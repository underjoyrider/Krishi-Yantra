export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import notificationService from '@/lib/notifications';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: any = {};
    if (userId) where.userId = userId;
    if (status && status !== 'ALL') where.status = status;

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        booking: { include: { center: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, bookingId, category, description, senderName } = await req.json();

    if (!userId || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, category, description' },
        { status: 400 }
      );
    }

    // Generate formatted ticket number like KQ-10483
    const count = await prisma.supportTicket.count();
    const ticketNumber = `KQ-${10480 + count + 1}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        bookingId: bookingId || null,
        category,
        description,
        status: 'SUBMITTED',
        messages: {
          create: {
            senderType: 'FARMER',
            senderName: senderName || 'Farmer',
            message: description,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    // Send confirmation notification
    await notificationService.send({
      userId,
      bookingId: bookingId || undefined,
      title: 'Support Request Received',
      message: `Your ticket ${ticketNumber} (${category}) has been logged. Our help desk is reviewing your details.`,
      type: 'QUEUE',
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
