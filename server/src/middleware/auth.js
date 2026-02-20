const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const tokenService = require('../services/auth/token.service');

function auth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required', 'UNAUTHORIZED'));
  }

  const token = header.split(' ')[1];

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Invalid or expired access token', 'UNAUTHORIZED'));
    }
    return next(error);
  }
}

module.exports = auth;

