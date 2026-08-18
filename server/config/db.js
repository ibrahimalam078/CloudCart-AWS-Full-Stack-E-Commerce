const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      logger.warn('MONGODB_URI is not set. Please update your .env file with a valid MongoDB connection string.');
      return;
    }
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    logger.warn('Server is running, but database operations will fail until MongoDB is connected.');
  }
};

module.exports = connectDB;
