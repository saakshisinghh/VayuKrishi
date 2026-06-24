import { redisClient, connectRedis } from "../../config/redis";
import { env } from "../../config/env";
import { logger } from "../../config/logger";

const NAMESPACE = "market";
const DEFAULT_TTL = env.MARKET_CACHE_TTL_SECONDS; // 15 minutes by default

/**
 * Thin caching wrapper around Redis for the market module.
 * Centralizing key-building here keeps cache keys consistent
 * between writers (sync) and readers (prices/commodity lookups).
 */
export class MarketCache {
  buildKey(suffix: string): string {
    return `${NAMESPACE}:${suffix}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      await connectRedis();
      const cached = await redisClient.get(key);
      return cached ? (JSON.parse(cached) as T) : null;
    } catch (err) {
      logger.warn(`Cache GET failed for key ${key}`, err);
      return null; // Cache failures should never break the request
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = DEFAULT_TTL): Promise<void> {
    try {
      await connectRedis();
      await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (err) {
      logger.warn(`Cache SET failed for key ${key}`, err);
    }
  }

  /**
   * Invalidates all market cache keys. Called after sync operations
   * so stale prices are never served after new data lands.
   */
  async invalidateAll(): Promise<void> {
    try {
      await connectRedis();
      const keys = await redisClient.keys(`${NAMESPACE}:*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
        logger.info(`Invalidated ${keys.length} market cache key(s)`);
      }
    } catch (err) {
      logger.warn("Cache invalidation failed", err);
    }
  }

  async invalidateByPrefix(prefix: string): Promise<void> {
    try {
      await connectRedis();
      const keys = await redisClient.keys(`${NAMESPACE}:${prefix}*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      logger.warn(`Cache invalidation failed for prefix ${prefix}`, err);
    }
  }
}

export const marketCache = new MarketCache();
