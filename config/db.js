// =============================================
// DESIGN PATTERN: Singleton
// Purpose: Ensures only one MongoDB connection
// exists throughout the application lifecycle.
// =============================================

const mongoose = require('mongoose');
const { mongoUri } = require('./env');
const logger = require('../utils/logger');

let connection = null;

async function connectDB() {
  if (connection) {
    logger.info('Reusing existing database connection');
    return connection;
  }

  try {
    connection = await mongoose.connect(mongoUri);
    logger.info(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
