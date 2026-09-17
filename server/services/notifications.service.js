const prisma = require('../prisma');
const { emitNotificationCreated } = require('../utils/socket.util');

async function getFarmerNotifications(userId) {
  const where = userId ? { userId } : {};
  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      booking: {
        include: { center: true },
      },
    },
  });

  return notifications;
}

async function markNotificationAsRead(id) {
  const updated = await prisma.notification.update({
    where: { id },
    data: {
      read: true,
      isRead: true,
    },
  });

  return updated;
}

async function createNotification({ userId, bookingId, title, message, type = 'GENERAL' }) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      bookingId: bookingId || null,
      title,
      message,
      type,
      read: false,
      isRead: false,
    },
  });

  emitNotificationCreated(userId, notification);
  return notification;
}

module.exports = {
  getFarmerNotifications,
  markNotificationAsRead,
  createNotification,
};
