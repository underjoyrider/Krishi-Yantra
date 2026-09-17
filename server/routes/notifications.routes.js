const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');

// Get notifications for a farmer
router.get('/', notificationsController.getNotifications);
router.get('/:farmerId', notificationsController.getNotifications);

// Mark notification as read
router.patch('/:id/read', notificationsController.markAsRead);

// Create notification
router.post('/', notificationsController.createNotification);

module.exports = router;
