const prisma = require('../prisma');
const { calculateWaitTime } = require('../utils/eta.util');
const {
  emitQueueUpdate,
  emitQueuePositionChanged,
  emitNotificationCreated,
} = require('../utils/socket.util');

async function getCenterQueue(centerId) {
  const center = await prisma.procurementCenter.findFirst({
    where: { OR: [{ id: centerId }, { code: centerId }] },
  });
  if (!center) return null;

  const activeEntries = await prisma.queueEntry.findMany({
    where: {
      centerId: center.id,
      status: { in: ['WAITING', 'PROCESSING'] },
    },
    orderBy: { queuePosition: 'asc' },
    include: {
      farmer: { select: { id: true, name: true, phone: true } },
      booking: true,
    },
  });

  const processing = activeEntries.find((e) => e.status === 'PROCESSING') || activeEntries[0] || null;
  const waiting = activeEntries.filter((e) => e.status === 'WAITING');

  return {
    centerId: center.id,
    centerName: center.name,
    totalInQueue: activeEntries.length,
    activeCounters: center.activeCounters,
    currentServing: processing?.booking?.tokenNumber || 'None',
    currentlyProcessing: processing,
    waitingList: waiting,
    queue: activeEntries,
  };
}

async function getBookingQueueStatus(bookingId) {
  const booking = await prisma.booking.findFirst({
    where: { OR: [{ id: bookingId }, { tokenNumber: bookingId }] },
    include: {
      center: true,
      user: true,
      queueEntry: true,
    },
  });

  if (!booking) return null;

  const queueData = await getCenterQueue(booking.centerId);
  const farmersAhead = Math.max(0, (booking.queuePosition || 1) - 1);

  const eta = calculateWaitTime({
    farmersAhead,
    avgProcessMins: booking.center.avgProcessMins || 5,
    activeCounters: booking.center.activeCounters || 3,
  });

  return {
    bookingId: booking.id,
    tokenNumber: booking.tokenNumber,
    centerId: booking.centerId,
    centerName: booking.center.name,
    currentServing: queueData?.currentServing || 'B-096',
    queuePosition: booking.queuePosition,
    farmersAhead,
    estimatedWaitTime: eta.minutes,
    estimatedWaitFormatted: eta.formatted,
    status: booking.status,
    cropType: booking.cropType,
    quantityKg: booking.quantityKg,
    bookingDate: booking.bookingDate,
    slotTime: `${booking.slotStartTime} – ${booking.slotEndTime}`,
  };
}

async function completeProcessing(bookingId) {
  const booking = await prisma.booking.findFirst({
    where: { OR: [{ id: bookingId }, { tokenNumber: bookingId }] },
    include: { center: true, queueEntry: true },
  });

  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Mark booking completed
    const updated = await tx.booking.update({
      where: { id: booking.id },
      data: { status: 'COMPLETED', queuePosition: 0, estimatedWait: 0 },
      include: { center: true, user: true },
    });

    // 2. Mark queue entry completed
    if (booking.queueEntry) {
      await tx.queueEntry.update({
        where: { id: booking.queueEntry.id },
        data: {
          status: 'COMPLETED',
          completedTime: new Date(),
          queuePosition: 0,
        },
      });
    }

    // 3. Shift queue positions of everyone behind
    const behind = await tx.queueEntry.findMany({
      where: {
        centerId: booking.centerId,
        status: { in: ['WAITING', 'PROCESSING'] },
        queuePosition: { gt: booking.queuePosition },
      },
      orderBy: { queuePosition: 'asc' },
    });

    for (const entry of behind) {
      const newPos = Math.max(1, entry.queuePosition - 1);
      const newWait = calculateWaitTime({
        farmersAhead: Math.max(0, newPos - 1),
        avgProcessMins: booking.center.avgProcessMins || 5,
        activeCounters: booking.center.activeCounters || 3,
      }).minutes;

      await tx.queueEntry.update({
        where: { id: entry.id },
        data: { queuePosition: newPos, estimatedWaitTime: newWait },
      });

      await tx.booking.update({
        where: { id: entry.bookingId },
        data: { queuePosition: newPos, estimatedWait: newWait },
      });

      emitQueuePositionChanged(entry.bookingId, {
        bookingId: entry.bookingId,
        newPosition: newPos,
        estimatedWait: newWait,
      });
    }

    // 4. Create Completion Notification
    const notification = await tx.notification.create({
      data: {
        userId: booking.farmerId,
        bookingId: booking.id,
        title: 'Procurement Completed',
        message: `Your produce procurement for token ${booking.tokenNumber} at ${booking.center.name} is complete. Thank you!`,
        type: 'COMPLETION',
        read: false,
        isRead: false,
      },
    });

    return { booking: updated, notification };
  });

  emitQueueUpdate(booking.centerId, {
    action: 'FARMER_COMPLETED',
    centerId: booking.centerId,
    completedBookingId: booking.id,
    tokenNumber: booking.tokenNumber,
  });
  emitNotificationCreated(booking.farmerId, result.notification);

  return result.booking;
}

module.exports = {
  getCenterQueue,
  getBookingQueueStatus,
  completeProcessing,
};
