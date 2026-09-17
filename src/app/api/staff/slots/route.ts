export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { centerId, date, startTime, endTime, capacity } = await req.json();

    const slot = await prisma.slot.create({
      data: {
        centerId,
        date: date || '2026-09-05',
        startTime,
        endTime,
        capacity: parseInt(capacity) || 15,
        bookedCount: 0,
        status: 'AVAILABLE',
      },
    });

    return NextResponse.json({ success: true, slot });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
