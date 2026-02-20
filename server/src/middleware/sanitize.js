const mongoSanitize = require('express-mongo-sanitize');

const sanitize = mongoSanitize({
  replaceWith: '_',
});

module.exports = sanitize;

