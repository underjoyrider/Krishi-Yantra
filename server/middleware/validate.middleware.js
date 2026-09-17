const { errorResponse } = require('../utils/response.util');

function validateBookingCreation(req, res, next) {
  const { farmerId, centerId, slotId, bookingDate } = req.body;

  if (!farmerId) {
    return errorResponse(res, 'Missing required field: farmerId', 400);
  }
  if (!centerId) {
    return errorResponse(res, 'Missing required field: centerId', 400);
  }
  if (!slotId && !bookingDate) {
    return errorResponse(res, 'Missing required field: slotId or bookingDate', 400);
  }

  next();
}

function validateFarmerCreation(req, res, next) {
  const { name, phone, phoneNumber } = req.body;

  if (!name || name.trim().length === 0) {
    return errorResponse(res, 'Missing or empty required field: name', 400);
  }

  const contactPhone = phone || phoneNumber;
  if (!contactPhone || contactPhone.trim().length < 10) {
    return errorResponse(res, 'Valid 10-digit phone number is required', 400);
  }

  next();
}

module.exports = {
  validateBookingCreation,
  validateFarmerCreation,
};
