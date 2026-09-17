const queuesService = require('../services/queues.service');
const { successResponse, errorResponse } = require('../utils/response.util');

async function getCenterQueue(req, res, next) {
  try {
    const { centerId } = req.params;
    const queueData = await queuesService.getCenterQueue(centerId);
    if (!queueData) {
      return errorResponse(res, `Procurement center not found with ID: ${centerId}`, 404);
    }
    return successResponse(res, queueData, 'Live center queue retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getBookingQueueStatus(req, res, next) {
  try {
    const { bookingId } = req.params;
    const statusData = await queuesService.getBookingQueueStatus(bookingId);
    if (!statusData) {
      return errorResponse(res, `Booking not found with ID: ${bookingId}`, 404);
    }
    return successResponse(res, statusData, 'Booking queue status retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function completeProcessing(req, res, next) {
  try {
    const { bookingId } = req.params;
    const completed = await queuesService.completeProcessing(bookingId);
    return successResponse(res, { booking: completed }, 'Farmer procurement processing marked as complete');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCenterQueue,
  getBookingQueueStatus,
  completeProcessing,
};
