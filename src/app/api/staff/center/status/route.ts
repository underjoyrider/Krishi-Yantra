export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { broadcastCenterStatus } from '@/lib/socket-server';

export async function PATCH(req: Request) {
  try {
    const { centerId, status } = await req.json();

    if (!centerId || !status) {
      return NextResponse.json(
        { error: 'centerId and status are required' },
        { status: 400 }
      );
    }

    const updated = await prisma.procurementCenter.update({
      where: { id: centerId },
      data: { status },
    });

    broadcastCenterStatus(centerId, status);

    return NextResponse.json({ success: true, center: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
