import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    let booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        center: true,
        slot: true,
        user: { include: { farmerProfile: true } },
      },
    });

    if (!booking) {
      booking = await prisma.booking.findFirst({
        where: { tokenNumber: params.id },
        include: {
          center: true,
          slot: true,
          user: { include: { farmerProfile: true } },
        },
      });
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, cropType, quantityKg } = await req.json();

    let booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) {
      booking = await prisma.booking.findFirst({ where: { tokenNumber: params.id } });
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        ...(status ? { status } : {}),
        ...(cropType ? { cropType } : {}),
        ...(quantityKg ? { quantityKg: parseInt(quantityKg) } : {}),
        updatedAt: new Date(),
      },
      include: { center: true, slot: true, user: true },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

