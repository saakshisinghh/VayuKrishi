import IORedis, { Redis } from 'ioredis';
import { env } from './env';
import { logger } from './logger';

/**
 * redis.ts
 * --------
 * Single source of truth for Redis configuration. Used for:
 *  - Caching (Phase 1+)
 *  - Refresh token storage / session management (Phase 2)
 *  - BullMQ queues / workers + notification caching (Phase 9)
 *  - Future rate-limiting / pub-sub use cases
 *
 * NOTE ON TLS:
 * Whether a managed Redis host needs TLS depends entirely on the provider
 * and plan — it is NOT something that can be safely inferred from the
 * hostname. Redis Cloud's free "Essentials Free" tier in particular does
 * NOT support TLS at all (the toggle isn't even available on that plan),
 * while paid tiers default to TLS off and require it to be explicitly
 * enabled in the dashboard. Guessing wrong in either direction produces
 * the exact same misleading error: ERR_SSL_WRONG_VERSION_NUMBER (one side
 * sends a TLS handshake, the other replies in plaintext, or vice versa).
 *
 * So TLS is opt-in here via REDIS_TLS=true in .env, matching whatever the
 * database's actual dashboard setting says — not inferred automatically.
 */

const useTLS = process.env.REDIS_TLS === 'true';

const baseRedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: env.REDIS_DB,
  ...(useTLS ? { tls: { servername: env.REDIS_HOST } } : {}),
};

// ─── App-wide client (caching, sessions, rate limiting) ───────────────────────
export const redisClient = new IORedis({
  ...baseRedisOptions,
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
  UNREAD_COUNT:   60,
  PREFERENCES:    300,
  NOTIFICATION_LIST: 30,
};

export const CACHE_KEYS = {
  schemesList:   (params: string) => `schemes:list:${params}`,
  schemeDetail:  (id: string)     => `schemes:detail:${id}`,
  searchResults: (params: string) => `schemes:search:${params}`,
};

export const RETRY_TRACKING_PREFIX = 'notif:retry:';
export const UNREAD_COUNT_PREFIX = 'notif:unread:';
export const PREFERENCES_CACHE_PREFIX = 'notif:prefs:';

// ─── BullMQ connection factory (Phase 9: notifications & background jobs) ────

export const redisConnectionOptions = {
  ...baseRedisOptions,
  maxRetriesPerRequest: null as null,
  enableReadyCheck: true,
  retryStrategy(times: number) {
    if (times > 10) {
      logger.error(
        `[Redis/BullMQ] Giving up after ${times} failed connection attempts to ` +
          `${env.REDIS_HOST}:${env.REDIS_PORT}. Check REDIS_HOST/PORT/PASSWORD/DB.`
      );
      return null;
    }
    return Math.min(times * 500, 5000);
  },
};

export const createRedisConnection = (): Redis => {
  const connection = new IORedis(redisConnectionOptions);

  let lastErrorLogged = '';
  connection.on('error', (err) => {
    if (err.message !== lastErrorLogged) {
      logger.error('[Redis/BullMQ] Connection error:', err.message);
      lastErrorLogged = err.message;
    }
  });

  connection.on('connect', () => {
    logger.info(`[Redis/BullMQ] Connected: ${env.REDIS_HOST}:${env.REDIS_PORT}`);
  });

  return connection;
};

export const cacheClient = createRedisConnection();