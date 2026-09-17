import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import notificationService from '@/lib/notifications';
import { broadcastBookingStatus, broadcastQueueUpdate } from '@/lib/socket-server';

export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { status, note } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: { user: true, center: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const oldStatus = booking.status;

    // Update status
    const updated = await prisma.booking.update({
      where: { id: params.bookingId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    // Create QueueEvent
    await prisma.queueEvent.create({
      data: {
        bookingId: booking.id,
        oldStatus,
        newStatus: status,
        note: note || `Status updated to ${status} by staff operator`,
      },
    });

    // Notify farmer based on status transition
    if (status === 'PROCESSING') {
      await notificationService.send({
        userId: booking.farmerId,
        bookingId: booking.id,
        title: 'Your Waiting Time Has Arrived',
        message: `Token ${booking.tokenNumber}: It's your turn now. Please proceed to Counter #1.`,
        type: 'QUEUE',
        phone: booking.user?.phone,
      });
    } else if (status === 'COMPLETED') {
      await notificationService.send({
        userId: booking.farmerId,
        bookingId: booking.id,
        title: 'Procurement Complete',
        message: `Token ${booking.tokenNumber}: Your agricultural procurement was successfully completed. Receipt generated.`,
        type: 'COMPLETION',
        phone: booking.user?.phone,
      });

      // Auto-promote next waiting farmer to PROCESSING if none currently processing
      const currentlyProcessing = await prisma.booking.count({
        where: {
          centerId: booking.centerId,
          status: 'PROCESSING',
        },
      });

      if (currentlyProcessing === 0) {
        const nextWaiting = await prisma.booking.findFirst({
          where: {
            centerId: booking.centerId,
            status: 'WAITING',
          },
          orderBy: [
            { slot: { startTime: 'asc' } },
            { createdAt: 'asc' },
          ],
          include: { user: true },
        });

        if (nextWaiting) {
          await prisma.booking.update({
            where: { id: nextWaiting.id },
            data: { status: 'PROCESSING' },
          });

          await prisma.queueEvent.create({
            data: {
              bookingId: nextWaiting.id,
              oldStatus: 'WAITING',
              newStatus: 'PROCESSING',
              note: 'Auto-promoted to processing after previous completion',
            },
          });

          await notificationService.send({
            userId: nextWaiting.farmerId,
            bookingId: nextWaiting.id,
            title: 'Your Waiting Time Has Arrived',
            message: `Token ${nextWaiting.tokenNumber}: It's your turn now. Please proceed immediately to the procurement counter.`,
            type: 'QUEUE',
            phone: nextWaiting.user?.phone,
          });

          broadcastBookingStatus(nextWaiting.id, {
            bookingId: nextWaiting.id,
            status: 'PROCESSING',
            tokenNumber: nextWaiting.tokenNumber,
          });
        }
      }
    } else if (status === 'NOTIFY') {
      await notificationService.send({
        userId: booking.farmerId,
        bookingId: booking.id,
        title: 'Your Waiting Time Is Coming Close',
        message: `Token ${booking.tokenNumber}: Your waiting time is coming close. Please remain near the procurement hall.`,
        type: 'QUEUE',
        phone: booking.user?.phone,
      });
    }

    // Check if any farmer is now <= 3 positions away and notify them
    const waitingQueue = await prisma.booking.findMany({
      where: {
        centerId: booking.centerId,
        status: 'WAITING',
      },
      orderBy: [
        { slot: { startTime: 'asc' } },
        { createdAt: 'asc' },
      ],
      include: { user: true },
    });

    waitingQueue.slice(0, 3).forEach(async (b, idx) => {
      const pos = idx + 1;
      if (pos === 3) {
        await notificationService.send({
          userId: b.farmerId,
          bookingId: b.id,
          title: 'Your Waiting Time Is Coming Close',
          message: `Token ${b.tokenNumber}: Your waiting time is coming close. You are 3 positions away.`,
          type: 'QUEUE',
          phone: b.user?.phone,
        });
      } else if (pos === 1) {
        await notificationService.send({
          userId: b.farmerId,
          bookingId: b.id,
          title: 'Your Waiting Time Is Almost Up',
          message: `Token ${b.tokenNumber}: You are #1 next! Please proceed to the procurement counter entrance.`,
          type: 'QUEUE',
          phone: b.user?.phone,
        });
      }
    });

    // Broadcast Socket.IO events
    broadcastBookingStatus(booking.id, {
      bookingId: booking.id,
      status,
      tokenNumber: booking.tokenNumber,
    });

    broadcastQueueUpdate(booking.centerId, {
      centerId: booking.centerId,
      action: 'STATUS_CHANGED',
      bookingId: booking.id,
      newStatus: status,
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
