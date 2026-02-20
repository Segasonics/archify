const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

morgan.token('id', (req) => req.id);

const requestLogger = [
  (req, _res, next) => {
    req.id = req.headers['x-request-id'] || uuidv4();
    next();
  },
  morgan(':method :url :status :response-time ms - reqId=:id', {
    stream: {
      write(message) {
        logger.info(message.trim());
      },
    },
  }),
];

module.exports = requestLogger;

