const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  logger.info({ mongo: env.MONGODB_URI }, 'MongoDB connected');
}

module.exports = connectDB;

