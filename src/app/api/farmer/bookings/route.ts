export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json({ error: 'farmerId query param required' }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
      include: {
        center: true,
        slot: true,
      },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
