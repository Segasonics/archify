const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const queue = require('./services/queue/inMemory.queue');
const { processGenerationJob } = require('./services/queue/jobs/generation.job');

queue.onProcess(processGenerationJob);

async function bootstrap() {
  await connectDB();

  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'Archify API listening');
  });

  const gracefulShutdown = async (signal) => {
    logger.info({ signal }, 'Shutting down gracefully');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to bootstrap server');
  process.exit(1);
});

