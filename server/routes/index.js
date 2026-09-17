const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const centersRoutes = require('./centers.routes');
const bookingsRoutes = require('./bookings.routes');
const farmersRoutes = require('./farmers.routes');
const queuesRoutes = require('./queues.routes');
const notificationsRoutes = require('./notifications.routes');
const staffRoutes = require('./staff.routes');
const supportRoutes = require('./support.routes');

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/centers', centersRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/farmers', farmersRoutes);
router.use('/queues', queuesRoutes);
router.use('/queue', queuesRoutes); // Alias for singular /api/queue
router.use('/notifications', notificationsRoutes);
router.use('/staff', staffRoutes);
router.use('/support', supportRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KrishiYantra Express Backend',
  });
});

// Guaranteed JSON 404 response for any unhandled API route
router.all('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

module.exports = router;
