import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import notificationService from '@/lib/notifications';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { senderType = 'FARMER', senderName, message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const newMsg = await prisma.supportMessage.create({
      data: {
        ticketId: params.id,
        senderType,
        senderName: senderName || (senderType === 'SUPPORT' ? 'Mandi Help Desk' : 'Farmer'),
        message: message.trim(),
      },
    });

    // If support replied, alert farmer
    if (senderType === 'SUPPORT') {
      await notificationService.send({
        userId: ticket.userId,
        bookingId: ticket.bookingId || undefined,
        title: 'Support Update',
        message: `Your support request ${ticket.ticketNumber} has received a response from Mandi Help Desk.`,
        type: 'QUEUE',
      });
    }

    return NextResponse.json({ success: true, message: newMsg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
