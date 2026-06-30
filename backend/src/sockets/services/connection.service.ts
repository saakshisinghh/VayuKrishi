import { createClient, RedisClientType } from 'redis';
import { UserPresence } from '../socket.types';

import { buildRedisUrl } from '../../config/redis';

const REDIS_URL = buildRedisUrl();
const PRESENCE_PREFIX = 'presence:';
const PRESENCE_TTL = 60 * 60; // 1 hour (refreshed on activity)

let redisClient: RedisClientType | null = null;

async function getClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({ url: REDIS_URL }) as RedisClientType;
    redisClient.on('error', (err) => console.error('[ConnectionService] Redis error:', err));
    await redisClient.connect();
  }
  return redisClient;
}

// ── Key helpers ───────────────────────────────────────────────
const userKey = (userId: string) => `${PRESENCE_PREFIX}user:${userId}`;
const onlineSetKey = () => `${PRESENCE_PREFIX}online_users`;

// ── ConnectionService ─────────────────────────────────────────
export const ConnectionService = {
  /**
   * Register a new socket connection for a user.
   */
  async connectUser(params: {
    userId: string;
    socketId: string;
    role: string;
    name: string;
  }): Promise<void> {
    const redis = await getClient();
    const now = new Date().toISOString();
    const key = userKey(params.userId);

    // Load existing or create new presence record
    const existing = await redis.get(key);
    const presence: UserPresence = existing
      ? (JSON.parse(existing) as UserPresence)
      : {
          userId: params.userId,
          socketIds: [],
          role: params.role,
          connectedAt: now,
          lastSeen: now,
          isOnline: true,
        };

    if (!presence.socketIds.includes(params.socketId)) {
      presence.socketIds.push(params.socketId);
    }
    presence.isOnline = true;
    presence.lastSeen = now;

    await Promise.all([
      redis.setEx(key, PRESENCE_TTL, JSON.stringify(presence)),
      redis.sAdd(onlineSetKey(), params.userId),
    ]);

    console.info(
      `[ConnectionService] userId=${params.userId} socketId=${params.socketId} connected. Total sockets=${presence.socketIds.length}`
    );
  },

  /**
   * Remove a socket connection. If no sockets remain, mark user offline.
   */
  async disconnectUser(userId: string, socketId: string): Promise<void> {
    const redis = await getClient();
    const key = userKey(userId);

    const existing = await redis.get(key);
    if (!existing) return;

    const presence = JSON.parse(existing) as UserPresence;
    presence.socketIds = presence.socketIds.filter((s) => s !== socketId);
    presence.lastSeen = new Date().toISOString();
    presence.isOnline = presence.socketIds.length > 0;

    if (presence.isOnline) {
      await redis.setEx(key, PRESENCE_TTL, JSON.stringify(presence));
    } else {
      // Keep presence for lastSeen but remove from online set
      await Promise.all([
        redis.setEx(key, PRESENCE_TTL, JSON.stringify(presence)),
        redis.sRem(onlineSetKey(), userId),
      ]);
    }

    console.info(
      `[ConnectionService] userId=${userId} socketId=${socketId} disconnected. Remaining=${presence.socketIds.length}`
    );
  },

  /**
   * Get all active socket IDs for a user (multi-tab / multi-device).
   */
  async getUserSockets(userId: string): Promise<string[]> {
    const redis = await getClient();
    const data = await redis.get(userKey(userId));
    if (!data) return [];
    return (JSON.parse(data) as UserPresence).socketIds;
  },

  /**
   * Get full presence record for a user.
   */
  async getUserPresence(userId: string): Promise<UserPresence | null> {
    const redis = await getClient();
    const data = await redis.get(userKey(userId));
    return data ? (JSON.parse(data) as UserPresence) : null;
  },

  /**
   * Return all currently online user IDs.
   */
  async getOnlineUsers(): Promise<string[]> {
    const redis = await getClient();
    return redis.sMembers(onlineSetKey());
  },

  /**
   * Return online user count.
   */
  async getOnlineCount(): Promise<number> {
    const redis = await getClient();
    return redis.sCard(onlineSetKey());
  },

  /**
   * Refresh TTL on user activity (call periodically or on each event).
   */
  async refreshPresence(userId: string): Promise<void> {
    const redis = await getClient();
    const key = userKey(userId);
    const data = await redis.get(key);
    if (!data) return;
    const presence = JSON.parse(data) as UserPresence;
    presence.lastSeen = new Date().toISOString();
    await redis.setEx(key, PRESENCE_TTL, JSON.stringify(presence));
  },
};
