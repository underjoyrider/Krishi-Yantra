export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import notificationService from '@/lib/notifications';
import { broadcastBookingStatus, broadcastQueueUpdate } from '@/lib/socket-server';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    let booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { center: true, slot: true },
    });

    if (!booking) {
      booking = await prisma.booking.findFirst({
        where: { tokenNumber: params.id },
        include: { center: true, slot: true },
      });
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json({
        success: true,
        message: 'Booking is already cancelled',
        booking,
      });
    }

    // Perform cancellation in transaction
    const updated = await prisma.$transaction(async (tx) => {
      // Update booking
      const b = await tx.booking.update({
        where: { id: booking!.id },
        data: {
          status: 'CANCELLED',
          queuePosition: 0,
          estimatedWait: 0,
          updatedAt: new Date(),
        },
      });

      // Update slot booked count if slot exists
      if (booking!.slotId) {
        const slot = await tx.slot.findUnique({ where: { id: booking!.slotId } });
        if (slot) {
          const newCount = Math.max(0, slot.bookedCount - 1);
          await tx.slot.update({
            where: { id: slot.id },
            data: {
              bookedCount: newCount,
              status: newCount < slot.capacity ? 'AVAILABLE' : 'FULL',
            },
          });
        }
      }

      // Update QueueEntry if exists
      const qe = await tx.queueEntry.findUnique({ where: { bookingId: booking!.id } });
      if (qe) {
        await tx.queueEntry.update({
          where: { bookingId: booking!.id },
          data: { status: 'CANCELLED', updatedAt: new Date() },
        });
      }

      // Create QueueEvent
      await tx.queueEvent.create({
        data: {
          bookingId: booking!.id,
          oldStatus: booking!.status,
          newStatus: 'CANCELLED',
          note: 'Booking cancelled by farmer',
        },
      });

      return b;
    });

    // Notify farmer
    try {
      await notificationService.send({
        userId: booking.farmerId,
        bookingId: booking.id,
        title: 'Booking Cancelled',
        message: `Your booking ${booking.tokenNumber} at ${booking.center.name} has been cancelled.`,
        type: 'BOOKING',
      });
    } catch (e) {
      console.error('Failed to send cancel notification:', e);
    }

    // Broadcast socket updates
    try {
      broadcastBookingStatus(booking.id, {
        bookingId: booking.id,
        status: 'CANCELLED',
        tokenNumber: booking.tokenNumber,
      });
      broadcastQueueUpdate(booking.centerId, {
        centerId: booking.centerId,
        action: 'BOOKING_CANCELLED',
        bookingId: booking.id,
      });
    } catch (e) {
      console.error('Socket broadcast error:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
