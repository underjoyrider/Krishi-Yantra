import prisma from './prisma';
import { broadcastNotification } from './socket-server';

export interface SendNotificationDTO {
  userId: string;
  bookingId?: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'QUEUE' | 'DELAY' | 'COMPLETION' | 'CLOSURE';
  phone?: string;
}

export interface INotificationService {
  send(data: SendNotificationDTO): Promise<any>;
}

class MockNotificationService implements INotificationService {
  async send(data: SendNotificationDTO) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          bookingId: data.bookingId,
          title: data.title,
          message: data.message,
          type: data.type,
          read: false,
        },
      });

      // Broadcast via socket to connected user room
      broadcastNotification(data.userId, notification);

      console.log(`[MockNotification] Pushed to User ${data.userId} (${data.phone || 'no-phone'}): [${data.title}] ${data.message}`);
      return notification;
    } catch (err) {
      console.error('Failed to create notification:', err);
      return null;
    }
  }
}

class TwilioNotificationService implements INotificationService {
  async send(data: SendNotificationDTO) {
    // Always create the in-app notification + socket broadcast first,
    // exactly like the mock service, so the farmer's app still shows the
    // alert even if the SMS leg below fails for any reason.
    const mock = new MockNotificationService();
    const notification = await mock.send(data);

    // Then actually try to send a real SMS via Twilio's REST API, using
    // plain fetch() so no extra SDK/dependency is required.
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!data.phone) {
      console.warn(`[Twilio SMS] Skipped — no phone number on file for user ${data.userId}.`);
      return notification;
    }

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('[Twilio SMS] Skipped — TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER not configured.');
      return notification;
    }

    try {
      const toNumber = data.phone.startsWith('+') ? data.phone : `+91${data.phone.replace(/\D/g, '').slice(-10)}`;
      const body = `${data.title}: ${data.message}`;

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          },
          body: new URLSearchParams({ To: toNumber, From: fromNumber, Body: body }).toString(),
        }
      );

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error(`[Twilio SMS] Failed to send to ${toNumber}: ${response.status} ${errText}`);
      } else {
        console.log(`[Twilio SMS] Sent to ${toNumber}: ${body}`);
      }
    } catch (err) {
      console.error('[Twilio SMS] Error sending SMS:', err);
    }

    return notification;
  }
}

export const notificationService: INotificationService =
  process.env.NOTIFICATION_PROVIDER === 'twilio' && process.env.TWILIO_ACCOUNT_SID
    ? new TwilioNotificationService()
    : new MockNotificationService();

export default notificationService;
