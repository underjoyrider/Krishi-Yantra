export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import notificationService from '@/lib/notifications';
import { broadcastBookingStatus, broadcastQueueUpdate } from '@/lib/socket-server';

export async function POST(req: Request) {
  try {
    const { centerCode = 'SHIV' } = await req.json().catch(() => ({}));

    const center = await prisma.procurementCenter.findUnique({
      where: { code: centerCode },
    });

    if (!center) {
      return NextResponse.json({ error: 'Center not found' }, { status: 404 });
    }

    // 1. If someone is currently PROCESSING, complete them!
    const currentlyProcessing = await prisma.booking.findFirst({
      where: {
        centerId: center.id,
        status: 'PROCESSING',
      },
      orderBy: { updatedAt: 'asc' },
      include: { user: true },
    });

    if (currentlyProcessing) {
      await prisma.booking.update({
        where: { id: currentlyProcessing.id },
        data: { status: 'COMPLETED' },
      });

      await prisma.queueEvent.create({
        data: {
          bookingId: currentlyProcessing.id,
          oldStatus: 'PROCESSING',
          newStatus: 'COMPLETED',
          note: 'Simulation: Farmer completed',
        },
      });

      await notificationService.send({
        userId: currentlyProcessing.farmerId,
        bookingId: currentlyProcessing.id,
        title: 'Procurement Complete',
        message: `Token ${currentlyProcessing.tokenNumber}: Procurement completed successfully.`,
        type: 'COMPLETION',
        phone: currentlyProcessing.user?.phone,
      });

      broadcastBookingStatus(currentlyProcessing.id, {
        bookingId: currentlyProcessing.id,
        status: 'COMPLETED',
        tokenNumber: currentlyProcessing.tokenNumber,
      });
    }

    // 2. Promote the next WAITING farmer to PROCESSING
    const nextWaiting = await prisma.booking.findFirst({
      where: {
        centerId: center.id,
        status: 'WAITING',
      },
      orderBy: [
        { slot: { startTime: 'asc' } },
        { createdAt: 'asc' },
      ],
      include: { user: true },
    });

    if (nextWaiting) {
      await prisma.booking.update({
        where: { id: nextWaiting.id },
        data: { status: 'PROCESSING' },
      });

      await prisma.queueEvent.create({
        data: {
          bookingId: nextWaiting.id,
          oldStatus: 'WAITING',
          newStatus: 'PROCESSING',
          note: 'Simulation: Called to counter',
        },
      });

      await notificationService.send({
        userId: nextWaiting.farmerId,
        bookingId: nextWaiting.id,
        title: 'Your Waiting Time Has Arrived',
        message: `Token ${nextWaiting.tokenNumber}: It's your turn now. Please proceed to the procurement counter.`,
        type: 'QUEUE',
        phone: nextWaiting.user?.phone,
      });

      broadcastBookingStatus(nextWaiting.id, {
        bookingId: nextWaiting.id,
        status: 'PROCESSING',
        tokenNumber: nextWaiting.tokenNumber,
      });
    }

    // 3. Check subsequent waiting farmers and trigger proximity alerts
    const remainingWaiting = await prisma.booking.findMany({
      where: {
        centerId: center.id,
        status: 'WAITING',
      },
      orderBy: [
        { slot: { startTime: 'asc' } },
        { createdAt: 'asc' },
      ],
      include: { user: true },
    });

    remainingWaiting.forEach(async (b, idx) => {
      const pos = idx + 1;
      if (pos === 3) {
        await notificationService.send({
          userId: b.farmerId,
          bookingId: b.id,
          title: 'Your Waiting Time Is Coming Close',
          message: `Token ${b.tokenNumber}: Your waiting time is coming close. You are 3 positions away.`,
          type: 'QUEUE',
          phone: b.user?.phone,
        });
      } else if (pos === 1) {
        await notificationService.send({
          userId: b.farmerId,
          bookingId: b.id,
          title: 'Your Waiting Time Is Almost Up',
          message: `Token ${b.tokenNumber}: You are position #1! Please get ready at the verification gate.`,
          type: 'QUEUE',
          phone: b.user?.phone,
        });
      }
    });

    // 4. Broadcast global queue update
    broadcastQueueUpdate(center.id, {
      centerId: center.id,
      action: 'SIMULATE_NEXT',
      completedToken: currentlyProcessing?.tokenNumber,
      nextCalledToken: nextWaiting?.tokenNumber,
    });

    return NextResponse.json({
      success: true,
      message: `Simulated: Completed ${currentlyProcessing?.tokenNumber || 'none'} and called ${nextWaiting?.tokenNumber || 'none'}`,
      completedToken: currentlyProcessing?.tokenNumber,
      nextCalledToken: nextWaiting?.tokenNumber,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
