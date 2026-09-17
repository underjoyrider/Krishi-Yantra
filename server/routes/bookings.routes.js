const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { validateBookingCreation } = require('../middleware/validate.middleware');

// Create new procurement booking
router.post('/', validateBookingCreation, bookingsController.createBooking);

// Get farmer bookings
router.get('/farmer/:farmerId', bookingsController.getFarmerBookings);

// Get booking details by ID or token
router.get('/:id', bookingsController.getBookingById);

// Cancel booking (supports both PATCH and POST)
router.patch('/:id/cancel', bookingsController.cancelBooking);
router.post('/:id/cancel', bookingsController.cancelBooking);
router.post('/cancel/:id', bookingsController.cancelBooking);

module.exports = router;
