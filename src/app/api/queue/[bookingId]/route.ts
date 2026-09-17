export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateETA } from '@/lib/eta';

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    let booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        center: true,
        slot: true,
        user: true,
      },
    });

    if (!booking) {
      booking = await prisma.booking.findFirst({
        where: { tokenNumber: params.bookingId },
        include: {
          center: true,
          slot: true,
          user: true,
        },
      });
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Find currently serving booking in this center
    const currentlyServing = await prisma.booking.findFirst({
      where: {
        centerId: booking.centerId,
        status: 'PROCESSING',
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Find all active bookings in queue ordered by slot time and creation time
    const activeQueue = await prisma.booking.findMany({
      where: {
        centerId: booking.centerId,
        status: { in: ['PROCESSING', 'WAITING'] },
      },
      orderBy: [
        { slot: { startTime: 'asc' } },
        { createdAt: 'asc' },
      ],
      include: { user: true, slot: true },
    });

    // Find index of this booking in active queue
    const queueIndex = activeQueue.findIndex((b) => b.id === booking.id);
    const position = queueIndex >= 0 ? queueIndex + 1 : 0;
    const peopleAhead = Math.max(0, queueIndex);

    // Dynamic rule-based ETA
    const eta = calculateETA({
      peopleAhead,
      avgProcessMins: booking.center.avgProcessMins,
      activeCounters: booking.center.activeCounters,
    });

    // Queue movement simulation history based on position
    let movementHistory = [12, 7, 5];
    if (position <= 4) movementHistory.push(4);
    if (position <= 3) movementHistory.push(3);
    if (position <= 2) movementHistory.push(2);
    if (position === 1) movementHistory.push(1);
    // deduplicate and ensure current position is last
    const uniqueHistory = Array.from(new Set([...movementHistory.filter((p) => p >= position), position]));

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        queuePosition: position,
        estimatedWait: eta.minutes,
      },
      currentlyServingToken: currentlyServing ? currentlyServing.tokenNumber : (activeQueue[0]?.tokenNumber || 'None'),
      currentlyServingName: currentlyServing ? (currentlyServing as any).user?.name : '',
      peopleAhead,
      etaLabel: eta.label,
      movementHistory: uniqueHistory,
      centerStatus: booking.center.status,
      centerName: booking.center.name,
      totalWaiting: activeQueue.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
