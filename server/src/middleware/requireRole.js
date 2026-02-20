const ApiError = require('../utils/ApiError');

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions', 'FORBIDDEN'));
    }

    return next();
  };
}

module.exports = requireRole;

