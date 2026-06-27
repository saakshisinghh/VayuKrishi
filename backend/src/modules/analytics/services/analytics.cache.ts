import { createClient } from 'redis';

// ── Redis client singleton ────────────────────────────────────
// This project's .env stores Redis connection details as separate
// fields (REDIS_HOST/REDIS_PORT/REDIS_PASSWORD/REDIS_TLS) rather than
// a single REDIS_URL, so we build the URL from those instead of
// falling back to a non-existent local Redis.
function buildRedisUrl(): string {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;

  const host = process.env.REDIS_HOST ?? 'localhost';
  const port = process.env.REDIS_PORT ?? '6379';
  const password = process.env.REDIS_PASSWORD;
  const useTls = process.env.REDIS_TLS === 'true';
  const protocol = useTls ? 'rediss' : 'redis';
  const auth = password ? `:${password}@` : '';

  return `${protocol}://${auth}${host}:${port}`;
}

let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!client) {
    const url = buildRedisUrl();
    
    client = createClient({ url });
    client.on('error', (err) => console.error('[Redis] Error:', err));
    await client.connect();
  }
  return client;
}

// ── TTLs (seconds) ────────────────────────────────────────────
export const CACHE_TTL = {
  OVERVIEW: 30 * 60,       // 30 min
  DASHBOARD: 30 * 60,
  MARKET: 30 * 60,
  SCHEMES: 30 * 60,
  FARMS: 15 * 60,
  CROPS: 15 * 60,
  DISEASES: 15 * 60,
  NOTIFICATIONS: 5 * 60,
} as const;

// ── Cache keys ────────────────────────────────────────────────
export function buildCacheKey(namespace: string, params: Record<string, unknown>): string {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => `${k}:${String(params[k])}`)
    .join('|');
  return `analytics:${namespace}${sorted ? ':' + sorted : ''}`;
}

// ── Wrapped cache-aside pattern ───────────────────────────────
export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const redis = await getRedisClient();
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const fresh = await fetcher();
    await redis.setEx(key, ttl, JSON.stringify(fresh));
    return fresh;
  } catch (err) {
    // Redis down → graceful fallback to DB
    console.warn('[Cache] Redis unavailable, falling back to DB:', (err as Error).message);
    return fetcher();
  }
}

// ── Invalidation helper ───────────────────────────────────────
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    const keys = await redis.keys(`analytics:${prefix}*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (err) {
    console.warn('[Cache] Could not invalidate prefix:', prefix, err);
  }
}
