const { errorResponse } = require('../utils/response.util');

function errorHandler(err, req, res, next) {
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal error occurred. Please try again.';

  return errorResponse(res, message, statusCode);
}

module.exports = {
  errorHandler,
};
