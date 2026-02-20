const logger = require('../config/logger');

function errorHandler(err, req, res, _next) {
  const multerError =
    err && err.name === 'MulterError'
      ? {
          statusCode: 400,
          code: 'UPLOAD_ERROR',
          message: err.message,
        }
      : null;

  const statusCode = multerError?.statusCode || err.statusCode || 500;
  const code = multerError?.code || err.code || 'INTERNAL_SERVER_ERROR';
  const message = statusCode === 500 ? 'Internal server error' : multerError?.message || err.message;

  logger.error(
    {
      requestId: req.id,
      statusCode,
      code,
      err,
    },
    'Request failed',
  );

  res.status(statusCode).json({
    message,
    code,
    details: err.details,
    requestId: req.id,
  });
}

module.exports = errorHandler;

