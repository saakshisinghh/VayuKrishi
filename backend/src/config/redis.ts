import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

/**
 * redis.ts
 * --------
 * Single shared Redis client used for:
 *  - Caching (Phase 1+)
 *  - Refresh token storage / session management (Phase 2)
 *  - Future rate-limiting / pub-sub use cases
 */

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: env.REDIS_DB,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('✅ Redis connected');
});

redisClient.on('error', (error) => {
  logger.error('❌ Redis connection error', { error });
});

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('❌ Redis connection failed', { error });
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  redisClient.disconnect();
  logger.info('Redis connection closed');
}
