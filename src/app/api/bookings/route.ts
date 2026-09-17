import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateETA } from '@/lib/eta';
import notificationService from '@/lib/notifications';
import { broadcastQueueUpdate } from '@/lib/socket-server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { farmerId, centerId, slotId, bookingDate, slotStartTime, slotEndTime, cropType, quantityKg } = body;

    if (!farmerId || !centerId) {
      return NextResponse.json(
        { error: 'Missing required fields: farmerId, centerId' },
        { status: 400 }
      );
    }

    // Resolve farmer user
    let farmer = await prisma.user.findUnique({ where: { id: farmerId } });
    if (!farmer) {
      farmer = await prisma.user.findFirst({ where: { role: 'FARMER' } });
      if (!farmer) {
        throw new Error('Farmer account not found.');
      }
    }

    // Resolve procurement center by ID or Code
    let center = await prisma.procurementCenter.findFirst({
      where: { OR: [{ id: centerId }, { code: centerId }] },
    });

    if (!center) {
      throw new Error('Procurement Center not found.');
    }

    // Resolve or auto-create slot
    let targetSlot = null;
    if (slotId) {
      targetSlot = await prisma.slot.findUnique({ where: { id: slotId } });
    }

    const dateToUse = bookingDate || targetSlot?.date || '2026-09-05';
    const startToUse = slotStartTime || targetSlot?.startTime || '09:00 AM';
    const endToUse = slotEndTime || targetSlot?.endTime || '10:00 AM';

    if (!targetSlot) {
      targetSlot = await prisma.slot.findFirst({
        where: {
          centerId: center.id,
          date: dateToUse,
          startTime: startToUse,
        },
      });

      if (!targetSlot) {
        targetSlot = await prisma.slot.create({
          data: {
            centerId: center.id,
            date: dateToUse,
            startTime: startToUse,
            endTime: endToUse,
            capacity: 15,
            bookedCount: 0,
            status: 'AVAILABLE',
          },
        });
      }
    }

    // Atomic transaction for concurrency safety
    const result = await prisma.$transaction(async (tx) => {
      if (targetSlot.status === 'DISABLED') {
        throw new Error('This slot is disabled by center staff.');
      }

      if (targetSlot.bookedCount >= targetSlot.capacity) {
        throw new Error(
          'This slot was just booked by another farmer. Please choose another slot.'
        );
      }

      if (center!.status === 'CLOSED') {
        throw new Error('This center is currently closed. Please select another center.');
      }

      // Count existing active queue in this center
      const activeBookingsCount = await tx.booking.count({
        where: {
          centerId: center!.id,
          status: { in: ['WAITING', 'PROCESSING'] },
        },
      });

      // Total bookings for token sequential generation
      const totalBookingsCount = await tx.booking.count({
        where: { centerId: center!.id },
      });

      // Generate token: Center prefix B- + sequential number
      const nextNum = 100 + totalBookingsCount + 1;
      const tokenNumber = `${center!.code || 'B'}-${nextNum}`;

      const queuePosition = activeBookingsCount + 1;
      const eta = calculateETA({
        peopleAhead: activeBookingsCount,
        avgProcessMins: center!.avgProcessMins,
        activeCounters: center!.activeCounters,
      });

      // Increment slot booked count
      await tx.slot.update({
        where: { id: targetSlot.id },
        data: {
          bookedCount: { increment: 1 },
          status: targetSlot.bookedCount + 1 >= targetSlot.capacity ? 'FULL' : 'AVAILABLE',
        },
      });

      // Create booking
      const booking = await tx.booking.create({
        data: {
          farmerId: farmer!.id,
          centerId: center!.id,
          slotId: targetSlot.id,
          bookingDate: dateToUse,
          slotStartTime: startToUse,
          slotEndTime: endToUse,
          tokenNumber,
          status: 'WAITING',
          estimatedWait: eta.minutes,
          queuePosition,
          cropType: cropType || 'Paddy / Rice',
          quantityKg: quantityKg ? parseInt(quantityKg) : 1000,
        },
        include: {
          center: true,
          slot: true,
          user: true,
        },
      });

      // Create queue entry
      await tx.queueEntry.create({
        data: {
          centerId: center!.id,
          farmerId: farmer!.id,
          bookingId: booking.id,
          queuePosition,
          status: 'WAITING',
          estimatedWaitTime: eta.minutes,
        },
      });

      // Create queue event
      await tx.queueEvent.create({
        data: {
          bookingId: booking.id,
          oldStatus: 'NONE',
          newStatus: 'WAITING',
          note: 'Booking confirmed via KrishiYantra portal',
        },
      });

      return booking;
    });

    // Send confirmation notification
    try {
      await notificationService.send({
        userId: farmer.id,
        bookingId: result.id,
        title: 'Booking Confirmed',
        message: `Your booking ${result.tokenNumber} at ${result.center.name} is confirmed for ${result.slot?.date || dateToUse} at ${result.slot?.startTime || startToUse}.`,
        type: 'BOOKING',
      });
    } catch (e) {
      console.error('Notification error:', e);
    }

    // Broadcast queue update
    try {
      broadcastQueueUpdate(center.id, {
        centerId: center.id,
        action: 'BOOKING_CREATED',
        bookingId: result.id,
      });
    } catch (e) {
      console.error('Socket error:', e);
    }

    return NextResponse.json({ success: true, booking: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to complete booking.' }, { status: 400 });
  }
}

