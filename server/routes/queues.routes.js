const express = require('express');
const router = express.Router();
const queuesController = require('../controllers/queues.controller');

// Get personalized queue status for a booking
router.get('/status/:bookingId', queuesController.getBookingQueueStatus);

// Mark processing completed and advance queue
router.patch('/:bookingId/complete', queuesController.completeProcessing);

// Get live queue for a center
router.get('/:centerId', queuesController.getCenterQueue);

module.exports = router;
