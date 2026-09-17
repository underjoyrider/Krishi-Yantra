import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateETA } from '@/lib/eta';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const centerCode = searchParams.get('centerCode') || 'SHIV';

    const center = await prisma.procurementCenter.findUnique({
      where: { code: centerCode },
    });

    if (!center) {
      return NextResponse.json({ error: 'Center not found' }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        centerId: center.id,
        status: { in: ['PROCESSING', 'WAITING'] },
      },
      orderBy: [
        { status: 'asc' }, // PROCESSING first
        { slot: { startTime: 'asc' } },
        { createdAt: 'asc' },
      ],
      include: {
        user: true,
        slot: true,
      },
    });

    // Recalculate dynamic positions and ETAs
    let processingCount = 0;
    const enriched = bookings.map((b, idx) => {
      if (b.status === 'PROCESSING') {
        processingCount++;
        return {
          ...b,
          queuePosition: processingCount,
          estimatedWait: 0,
        };
      } else {
        const peopleAhead = idx - processingCount;
        const eta = calculateETA({
          peopleAhead,
          avgProcessMins: center.avgProcessMins,
          activeCounters: center.activeCounters,
        });
        return {
          ...b,
          queuePosition: idx + 1,
          estimatedWait: eta.minutes,
        };
      }
    });

    return NextResponse.json({
      success: true,
      center,
      queue: enriched,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
