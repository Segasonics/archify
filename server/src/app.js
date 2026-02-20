const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/cors');
const routes = require('./routes');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const sanitize = require('./middleware/sanitize');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { handleStripeWebhook } = require('./controllers/webhook.controller');

const app = express();

app.set('trust proxy', 1);

app.use(requestLogger);
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitize);
app.use(apiLimiter);
app.use('/api/auth', authLimiter);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'archify-api' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

