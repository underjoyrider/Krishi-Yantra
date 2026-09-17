const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');

// Queue operations
router.get('/queue', staffController.getQueue);
router.post('/queue/simulate', staffController.simulateNext);
router.post('/queue/:bookingId/status', staffController.updateBookingStatus);
router.patch('/queue/:bookingId/status', staffController.updateBookingStatus);

// Dashboard & Analytics
router.get('/dashboard', staffController.getDashboard);
router.get('/analytics', staffController.getAnalytics);

// Center Status
router.post('/center/status', staffController.updateCenterStatus);
router.patch('/center/status', staffController.updateCenterStatus);

// Slots management
router.patch('/slots/:id', staffController.updateSlot);

module.exports = router;
