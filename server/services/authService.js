const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');
const AppError = require('../utils/AppError');
const config = require('../config');

/**
 * Generate JWT token for user
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered. Please login.', 400);
  }

  // Security: ALL registrations are consumer-only.
  // Admin accounts are created exclusively via the seed script or by existing admins.
  const user = await User.create({
    name,
    email,
    password,
    role: 'consumer',
  });

  // Create empty cart for the new user
  await Cart.create({ user: user._id, items: [] });

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Login user
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Get user profile
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, { name, email }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email is already in use by another account.', 400);
    }
    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    updatedAt: user.updatedAt,
  };
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
