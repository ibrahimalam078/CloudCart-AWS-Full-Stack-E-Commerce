const AppError = require('../utils/AppError');

/**
 * Admin authorization middleware.
 * Must be used AFTER auth middleware.
 * Checks that the authenticated user has admin role.
 * Role is verified from the database (via auth middleware), never from the frontend.
 */
const admin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }

  next();
};

module.exports = admin;
