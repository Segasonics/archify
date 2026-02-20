const env = require('./env');

const allowList = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowList.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin denied'));
  },
  credentials: true,
};

module.exports = corsOptions;

