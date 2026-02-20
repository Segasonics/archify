const ApiError = require('../utils/ApiError');

function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
    });

    if (!result.success) {
      return next(
        new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', result.error.flatten()),
      );
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    req.file = result.data.file;

    return next();
  };
}

module.exports = validate;

