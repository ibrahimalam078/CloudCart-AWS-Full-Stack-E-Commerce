const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const config = require('../config');

/**
 * Authentication middleware.
 * Verifies JWT from Authorization header and attaches user to req.
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Token has expired. Please login again.', 401);
      }
      if (err.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token. Please login again.', 401);
      }
      throw new AppError('Authentication failed.', 401);
    }

    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('User not found. Token is invalid.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
