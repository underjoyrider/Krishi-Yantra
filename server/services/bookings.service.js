const prisma = require('../prisma');
const { calculateWaitTime, calculateRecommendedArrival } = require('../utils/eta.util');
const { generateToken } = require('../utils/token.util');
const {
  emitBookingCreated,
  emitBookingCancelled,
  emitQueueUpdate,
  emitNotificationCreated,
  emitQueuePositionChanged,
} = require('../utils/socket.util');

async function createBooking(data) {
  const {
    farmerId,
    centerId,
    slotId,
    bookingDate = '2026-09-05',
    slotStartTime = '09:00 AM',
    slotEndTime = '10:00 AM',
    cropType = 'Paddy / Rice',
    quantityKg = 1500,
  } = data;

  // 1. Validate farmer
  const farmer = await prisma.user.findUnique({
    where: { id: farmerId },
  });
  if (!farmer) {
    const error = new Error(`Farmer not found with ID: ${farmerId}`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Validate center
  const center = await prisma.procurementCenter.findUnique({
    where: { id: centerId },
  });
  if (!center) {
    const error = new Error(`Procurement center not found with ID: ${centerId}`);
    error.statusCode = 404;
    throw error;
  }

  if (center.status === 'CLOSED') {
    const error = new Error('This procurement center is currently closed. Please select an open center.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Prevent duplicate active booking
  const existingActive = await prisma.booking.findFirst({
    where: {
      farmerId,
      status: { in: ['BOOKED', 'WAITING', 'CHECKED_IN', 'PROCESSING'] },
      centerId,
    },
  });
  if (existingActive) {
    const error = new Error(
      `You already have an active booking (${existingActive.tokenNumber}) at this center. Please complete or cancel it first.`
    );
    error.statusCode = 409;
    throw error;
  }

  // 4. Concurrency-safe atomic transaction
  const result = await prisma.$transaction(async (tx) => {
    let resolvedSlot = null;
    let actualStartTime = slotStartTime;
    let actualEndTime = slotEndTime;
    let actualDate = bookingDate;

    if (slotId) {
      resolvedSlot = await tx.slot.findUnique({
        where: { id: slotId },
      });
      if (!resolvedSlot) {
        throw new Error('Selected slot does not exist.');
      }
      if (resolvedSlot.status === 'DISABLED') {
        throw new Error('This slot has been disabled by the mandi operator.');
      }
      if (resolvedSlot.bookedCount >= resolvedSlot.capacity) {
        throw new Error('This slot is fully booked. Please select another time window.');
      }

      actualStartTime = resolvedSlot.startTime;
      actualEndTime = resolvedSlot.endTime;
      actualDate = resolvedSlot.date;

      // Increment slot booked count
      await tx.slot.update({
        where: { id: slotId },
        data: {
          bookedCount: { increment: 1 },
          status: resolvedSlot.bookedCount + 1 >= resolvedSlot.capacity ? 'FULL' : 'AVAILABLE',
        },
      });
    }

    // Active queue count
    const activeCount = await tx.queueEntry.count({
      where: {
        centerId,
        status: { in: ['WAITING', 'PROCESSING'] },
      },
    });

    const totalCenterBookings = await tx.booking.count({
      where: { centerId },
    });

    // Token & queue positioning
    const tokenNumber = generateToken({
      centerCode: center.code,
      sequenceNumber: 101 + totalCenterBookings,
    });

    const queuePosition = activeCount + 1;
    const eta = calculateWaitTime({
      farmersAhead: activeCount,
      avgProcessMins: center.avgProcessMins || center.averageProcessingTime || 5,
      activeCounters: center.activeCounters || 3,
    });

    // Create Booking
    const newBooking = await tx.booking.create({
      data: {
        farmerId,
        centerId,
        slotId: resolvedSlot?.id || null,
        bookingDate: actualDate,
        slotStartTime: actualStartTime,
        slotEndTime: actualEndTime,
        tokenNumber,
        status: 'WAITING',
        estimatedWait: eta.minutes,
        queuePosition,
        cropType,
        quantityKg: parseInt(quantityKg, 10) || 1000,
      },
      include: {
        center: true,
        user: true,
        slot: true,
      },
    });

    // Create QueueEntry
    const queueEntry = await tx.queueEntry.create({
      data: {
        centerId,
        farmerId,
        bookingId: newBooking.id,
        queuePosition,
        status: 'WAITING',
        estimatedWaitTime: eta.minutes,
      },
    });

    // Create QueueEvent audit
    await tx.queueEvent.create({
      data: {
        bookingId: newBooking.id,
        oldStatus: 'NONE',
        newStatus: 'WAITING',
        note: `Booking confirmed with token ${tokenNumber}. Queue position #${queuePosition}.`,
      },
    });

    // Create Confirmation Notification
    const notification = await tx.notification.create({
      data: {
        userId: farmerId,
        bookingId: newBooking.id,
        title: 'Procurement Slot Booked Successfully',
        message: `Your procurement slot at ${center.name} is confirmed for ${actualDate} (${actualStartTime} – ${actualEndTime}). Token: ${tokenNumber}. Position: #${queuePosition}.`,
        type: 'BOOKING_CONFIRMATION',
        read: false,
        isRead: false,
      },
    });

    return { booking: newBooking, queueEntry, notification };
  });

  // Real-time broadcasts
  emitBookingCreated(result.booking);
  emitQueueUpdate(centerId, {
    action: 'BOOKING_CREATED',
    centerId,
    bookingId: result.booking.id,
    tokenNumber: result.booking.tokenNumber,
  });
  emitNotificationCreated(farmerId, result.notification);

  return result.booking;
}

async function getBookingById(id) {
  const booking = await prisma.booking.findFirst({
    where: {
      OR: [{ id: id }, { tokenNumber: id }],
    },
    include: {
      center: true,
      slot: true,
      user: {
        include: { farmerProfile: true },
      },
      queueEntry: true,
    },
  });

  if (!booking) return null;

  const farmersAhead = Math.max(0, (booking.queuePosition || 1) - 1);
  const recommendedArrival = calculateRecommendedArrival(
    booking.slotStartTime || booking.slot?.startTime || '10:00 AM'
  );

  return {
    ...booking,
    farmersAhead,
    recommendedArrival,
    estimatedWaitFormatted: `${booking.estimatedWait} min`,
  };
}

async function getFarmerBookings(farmerId) {
  const all = await prisma.booking.findMany({
    where: { farmerId },
    orderBy: { createdAt: 'desc' },
    include: {
      center: true,
      slot: true,
      queueEntry: true,
    },
  });

  const active = all.filter((b) => ['WAITING', 'PROCESSING', 'BOOKED', 'CHECKED_IN'].includes(b.status));
  const completed = all.filter((b) => b.status === 'COMPLETED');
  const cancelled = all.filter((b) => ['CANCELLED', 'MISSED'].includes(b.status));

  return {
    active: active[0] || null,
    activeBookings: active,
    upcomingBookings: active,
    completedBookings: completed,
    cancelledBookings: cancelled,
    allBookings: all,
  };
}

async function cancelBooking(id, farmerId = null) {
  const booking = await prisma.booking.findFirst({
    where: { OR: [{ id }, { tokenNumber: id }] },
    include: { center: true, slot: true, queueEntry: true, user: true },
  });

  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  // Validate that the requesting farmer owns the booking if farmerId is provided
  if (farmerId) {
    const isOwner =
      booking.farmerId === farmerId ||
      booking.user?.id === farmerId ||
      booking.user?.phone === farmerId;
    if (!isOwner) {
      const error = new Error('You do not have permission to cancel this booking.');
      error.statusCode = 403;
      throw error;
    }
  }

  // Prevent cancellation if already COMPLETED or CANCELLED
  if (booking.status === 'COMPLETED') {
    const error = new Error('Cannot cancel a booking that has already been completed.');
    error.statusCode = 400;
    throw error;
  }

  if (booking.status === 'CANCELLED') {
    const error = new Error('This booking is already cancelled.');
    error.statusCode = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update booking
    const updated = await tx.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' },
      include: { center: true, user: true },
    });

    // 2. Update QueueEntry
    if (booking.queueEntry) {
      await tx.queueEntry.update({
        where: { id: booking.queueEntry.id },
        data: { status: 'CANCELLED' },
      });
    }

    // 3. Restore slot capacity if applicable
    if (booking.slotId) {
      await tx.slot.update({
        where: { id: booking.slotId },
        data: {
          bookedCount: { decrement: 1 },
          status: 'AVAILABLE',
        },
      });
    }

    // 4. Reconcile queue positions for farmers behind this one
    const cancelledPos = booking.queuePosition;
    const behindEntries = await tx.queueEntry.findMany({
      where: {
        centerId: booking.centerId,
        status: { in: ['WAITING', 'PROCESSING'] },
        queuePosition: { gt: cancelledPos },
      },
      orderBy: { queuePosition: 'asc' },
    });

    for (const entry of behindEntries) {
      const newPos = entry.queuePosition - 1;
      const newWait = calculateWaitTime({
        farmersAhead: Math.max(0, newPos - 1),
        avgProcessMins: booking.center.avgProcessMins || 5,
        activeCounters: booking.center.activeCounters || 3,
      }).minutes;

      await tx.queueEntry.update({
        where: { id: entry.id },
        data: {
          queuePosition: newPos,
          estimatedWaitTime: newWait,
        },
      });

      await tx.booking.update({
        where: { id: entry.bookingId },
        data: {
          queuePosition: newPos,
          estimatedWait: newWait,
        },
      });

      emitQueuePositionChanged(entry.bookingId, {
        bookingId: entry.bookingId,
        newPosition: newPos,
        estimatedWait: newWait,
      });
    }

    // 5. Cancellation notification
    const notification = await tx.notification.create({
      data: {
        userId: booking.farmerId,
        bookingId: booking.id,
        title: 'Booking Cancelled',
        message: `Your booking ${booking.tokenNumber} at ${booking.center.name} has been cancelled.`,
        type: 'QUEUE_UPDATE',
        read: false,
        isRead: false,
      },
    });

    return { booking: updated, notification };
  });

  emitBookingCancelled(result.booking);
  emitQueueUpdate(booking.centerId, {
    action: 'BOOKING_CANCELLED',
    centerId: booking.centerId,
    bookingId: booking.id,
  });
  emitNotificationCreated(booking.farmerId, result.notification);

  return result.booking;
}

module.exports = {
  createBooking,
  getBookingById,
  getFarmerBookings,
  cancelBooking,
};
