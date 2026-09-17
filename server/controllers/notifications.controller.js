const notificationsService = require('../services/notifications.service');
const { successResponse, errorResponse } = require('../utils/response.util');

async function getNotifications(req, res, next) {
  try {
    const farmerId = req.params.farmerId || req.query.farmerId || null;
    const notifications = await notificationsService.getFarmerNotifications(farmerId);
    return successResponse(res, { notifications }, 'Notifications retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await notificationsService.markNotificationAsRead(id);
    return successResponse(res, { notification: updated }, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

async function createNotification(req, res, next) {
  try {
    const { userId, bookingId, title, message, type } = req.body;
    if (!userId || !title || !message) {
      return errorResponse(res, 'userId, title, and message are required', 400);
    }
    const created = await notificationsService.createNotification({
      userId,
      bookingId,
      title,
      message,
      type,
    });
    return successResponse(res, { notification: created }, 'Notification created successfully', 201);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
};
