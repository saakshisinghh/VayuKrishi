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

// ─── Cache helpers (used by scheme.service.ts) ────────────────────────────────

export async function get(key: string): Promise<string | null> {
  try { return await redisClient.get(key); } catch { return null; }
}

export async function set(key: string, value: string, ttlSeconds = 1800): Promise<void> {
  try { await redisClient.set(key, value, 'EX', ttlSeconds); } catch { /* silent */ }
}

export async function del(key: string): Promise<void> {
  try { await redisClient.del(key); } catch { /* silent */ }
}

export async function delByPattern(pattern: string): Promise<void> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) await redisClient.del(...keys);
  } catch { /* silent */ }
}

export const CACHE_TTL = {
  SCHEMES_LIST:   30 * 60,
  SCHEME_DETAIL:  30 * 60,
  SEARCH_RESULTS: 30 * 60,
};

export const CACHE_KEYS = {
  schemesList:   (params: string) => `schemes:list:${params}`,
  schemeDetail:  (id: string)     => `schemes:detail:${id}`,
  searchResults: (params: string) => `schemes:search:${params}`,
};