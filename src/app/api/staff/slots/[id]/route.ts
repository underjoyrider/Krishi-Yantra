export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { capacity, status } = await req.json();

    const data: any = {};
    if (capacity !== undefined) {
      const cap = parseInt(capacity);
      data.capacity = cap;
      const current = await prisma.slot.findUnique({ where: { id: params.id } });
      if (current && current.status !== 'DISABLED') {
        data.status = current.bookedCount >= cap ? 'FULL' : 'AVAILABLE';
      }
    }
    if (status !== undefined) data.status = status;

    const slot = await prisma.slot.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, slot });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
