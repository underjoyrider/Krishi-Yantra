/**
 * Standardized API Response Utilities
 */

function successResponse(res, data = null, message = null, statusCode = 200) {
  const response = {
    success: true,
    data: data,
  };

  if (message) {
    response.message = message;
  }

  // Backwards-compatibility convenience spread if data is an object and not array
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(response, data);
  }

  return res.status(statusCode).json(response);
}

function errorResponse(res, message = 'Internal server error', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message: message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  successResponse,
  errorResponse,
};
