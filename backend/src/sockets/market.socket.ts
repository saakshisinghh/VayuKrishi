import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './socket.types';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

// Whitelist of tradeable commodities (extend as needed)
const VALID_COMMODITIES = new Set([
  'wheat', 'rice', 'cotton', 'soybean', 'maize', 'sugarcane',
  'onion', 'potato', 'tomato', 'mustard', 'groundnut', 'chana',
  'arhar', 'moong', 'urad', 'bajra', 'jowar', 'ragi',
]);

function normalizeCommodity(commodity: string): string {
  return commodity.trim().toLowerCase().replace(/\s+/g, '_');
}

export function registerMarketSocket(io: AppServer, socket: AuthenticatedSocket): void {
  const { _id: userId } = socket.user;
  const subscribedCommodities = new Set<string>();

  // ── market:subscribe ──────────────────────────────────────
  socket.on('market:subscribe', async (commodity: string) => {
    try {
      const normalized = normalizeCommodity(commodity);

      if (!VALID_COMMODITIES.has(normalized)) {
        socket.emit('error', { message: `Unknown commodity: ${commodity}`, code: 'INVALID_COMMODITY' });
        return;
      }

      const room = `commodity:${normalized}`;
      await socket.join(room);
      subscribedCommodities.add(normalized);

      console.info(`[MarketSocket] userId=${userId} subscribed to commodity=${normalized}`);

      // Send an immediate acknowledgement
      socket.emit('market:update', {
        commodity: normalized,
        state: 'all',
        market: 'all',
        pricePerQuintal: 0,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[MarketSocket] market:subscribe error', err);
      socket.emit('error', { message: 'Failed to subscribe', code: 'MARKET_SUBSCRIBE_FAILED' });
    }
  });

  // ── market:unsubscribe ────────────────────────────────────
  socket.on('market:unsubscribe', async (commodity: string) => {
    try {
      const normalized = normalizeCommodity(commodity);
      const room = `commodity:${normalized}`;
      await socket.leave(room);
      subscribedCommodities.delete(normalized);
      console.info(`[MarketSocket] userId=${userId} unsubscribed from commodity=${normalized}`);
    } catch (err) {
      console.error('[MarketSocket] market:unsubscribe error', err);
    }
  });

  // ── Cleanup on disconnect ─────────────────────────────────
  socket.on('disconnect', async () => {
    for (const commodity of subscribedCommodities) {
      await socket.leave(`commodity:${commodity}`);
    }
    subscribedCommodities.clear();
  });
}
