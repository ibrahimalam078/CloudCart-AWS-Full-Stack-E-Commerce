const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Centralized error handling middleware.
 * Catches all errors passed via next(error) and returns a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error
  logger.error(`${err.message}`, { stack: err.stack, url: req.originalUrl, method: req.method });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError('Resource not found.', 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`Duplicate value for '${field}'. This ${field} is already in use.`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join('. '), 400);
  }

  // JWT errors (fallback — normally caught in auth middleware)
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired.', 401);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File size exceeds the 5MB limit.', 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
