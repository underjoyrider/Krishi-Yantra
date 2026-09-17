import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import notificationService from '@/lib/notifications';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        booking: { include: { center: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    const ticket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status, updatedAt: new Date() },
      include: { user: true },
    });

    // Notify farmer about status update
    await notificationService.send({
      userId: ticket.userId,
      bookingId: ticket.bookingId || undefined,
      title: 'Support Status Update',
      message: `Your support request ${ticket.ticketNumber} is now marked as ${status.replace('_', ' ')}.`,
      type: 'QUEUE',
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
