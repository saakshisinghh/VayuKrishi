/**
 * server.ts
 * -----------
 * Application entry point. Responsible for:
 *  1. Connecting to MongoDB and Redis BEFORE accepting traffic.
 *  2. Starting the HTTP server (app from app.ts).
 *  3. Graceful shutdown on SIGINT/SIGTERM and on unhandled errors —
 *     closes the HTTP server, then DB/Redis connections, before exiting.
 */
import './shared/types/express.types';
import http from 'http';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { createApp } from './app';
import { initializeJobs, shutdownJobs } from "./jobs";
import { initializeSocketServer } from './sockets';
import { realtimeRouter } from './modules/realtime';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await connectRedis();
 await initializeJobs();
 
  const app = createApp();
  const server = http.createServer(app);
  await initializeSocketServer(server);
app.use(`${env.API_PREFIX}/realtime`, realtimeRouter);

  server.listen(env.PORT, () => {
    logger.info(`🚀 Vayukrishi API running on port ${env.PORT} [${env.NODE_ENV}]`);
    logger.info(`   Health check: http://localhost:${env.PORT}/health`);
    logger.info(`   API base:     http://localhost:${env.PORT}${env.API_PREFIX}`);
  });

  async function shutdown(signal: string): Promise<void> {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await shutdownJobs();
        await disconnectDatabase();
        await disconnectRedis();
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', { error });
        process.exit(1);
      }
    });

    // Force-exit if shutdown hangs for more than 10s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection', { reason });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error });
    process.exit(1);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
