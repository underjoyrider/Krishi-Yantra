const bookingsService = require('../services/bookings.service');
const { successResponse, errorResponse } = require('../utils/response.util');

async function createBooking(req, res, next) {
  try {
    const booking = await bookingsService.createBooking(req.body);
    return successResponse(res, { booking }, 'Procurement slot booked successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await bookingsService.getBookingById(id);
    if (!booking) {
      return errorResponse(res, `Booking not found with ID or token: ${id}`, 404);
    }
    return successResponse(res, { booking }, 'Booking details retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getFarmerBookings(req, res, next) {
  try {
    const { farmerId } = req.params;
    const bookingsData = await bookingsService.getFarmerBookings(farmerId);
    return successResponse(res, bookingsData, 'Farmer bookings retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const farmerId =
      req.body?.farmerId ||
      req.query?.farmerId ||
      req.headers['x-user-id'] ||
      req.headers['x-user-phone'] ||
      null;

    const cancelled = await bookingsService.cancelBooking(id, farmerId);
    return res.status(200).json({
      success: true,
      message: 'Your booking has been cancelled successfully.',
      booking: cancelled,
    });
  } catch (err) {
    console.error('[Bookings Error] cancelBooking:', err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to cancel booking',
    });
  }
}

module.exports = {
  createBooking,
  getBookingById,
  getFarmerBookings,
  cancelBooking,
};
