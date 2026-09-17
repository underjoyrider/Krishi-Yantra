import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { farmerId: string } }
) {
  try {
    const farmerId = params.farmerId;

    const bookings = await prisma.booking.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
      include: {
        center: true,
        slot: true,
        user: true,
      },
    });

    const active = bookings.find((b) =>
      ['WAITING', 'PROCESSING', 'BOOKED'].includes(b.status)
    );

    return NextResponse.json({
      success: true,
      active: active || null,
      booking: active || bookings[0] || null,
      bookings,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
