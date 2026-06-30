import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  AuthenticatedSocket,
} from './socket.types';
import { socketAuthMiddleware } from './middleware/socket-auth.middleware';
import { ConnectionService } from './services/connection.service';
import { setIoInstance } from './services/socket.service';
import { registerNotificationSocket } from './notification.socket';
import { registerMarketSocket } from './market.socket';
import { registerAssistantSocket } from './assistant.socket';
import { registerAnalyticsSocket } from './analytics.socket';

import { buildRedisUrl } from '../config/redis';

const REDIS_URL = buildRedisUrl();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

let io: AppServer;

export async function initializeSocketServer(httpServer: HttpServer): Promise<AppServer> {
  // ── 1. Create Socket.io server ────────────────────────────
  io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: {
        origin: CLIENT_ORIGIN.split(',').map((o) => o.trim()),
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 20000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      maxHttpBufferSize: 1e6, // 1 MB max event payload
      path: '/socket.io',
    }
  );

  // ── 2. Redis pub/sub adapter (horizontal scaling) ─────────
  try {
    const pubClient = createClient({ url: REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.info('[SocketServer] Redis adapter connected — horizontal scaling enabled');
  } catch (err) {
    console.warn('[SocketServer] Redis adapter failed, falling back to in-memory:', (err as Error).message);
  }

  // ── 3. Authentication middleware ──────────────────────────
  io.use((socket, next) => socketAuthMiddleware(socket, next));

  // ── 4. Rate limit middleware (per-socket) ─────────────────
  io.use((socket, next) => {
    const eventCounts = new Map<string, number>();
    const RATE_WINDOW = 10_000; // 10 seconds
    const MAX_EVENTS = 100;

    const originalOnEvent = socket.onAny.bind(socket);
    socket.onAny((eventName: string) => {
      const count = (eventCounts.get(eventName) ?? 0) + 1;
      eventCounts.set(eventName, count);

      if (count > MAX_EVENTS) {
        console.warn(`[SocketServer] Rate limit exceeded socketId=${socket.id} event=${eventName}`);
        socket.emit('error', { message: 'Rate limit exceeded', code: 'RATE_LIMITED' });
        socket.disconnect(true);
      }
    });

    setInterval(() => eventCounts.clear(), RATE_WINDOW).unref();
    next();
  });

  // ── 5. Connection handler ─────────────────────────────────
  io.on('connection', async (socket) => {
    const authedSocket = socket as AuthenticatedSocket;
    const { _id: userId, role, name } = authedSocket.user;

    console.info(`[SocketServer] Connected userId=${userId} role=${role} socketId=${socket.id}`);

    // Register presence in Redis
    await ConnectionService.connectUser({ userId, socketId: socket.id, role, name });

    // Auto-join private user room and role room
    await socket.join(`user:${userId}`);
    await socket.join(`role:${role}`);

    // Auto-join state room if user has a state in their profile
    // (wire this from your User model when available)
    // if (authedSocket.user.state) await socket.join(`state:${authedSocket.user.state}`);

    // Register domain handlers
    registerNotificationSocket(io, authedSocket);
    registerMarketSocket(io, authedSocket);
    registerAssistantSocket(io, authedSocket);
    registerAnalyticsSocket(io, authedSocket);

    // Refresh presence on any activity
    socket.onAny(async () => {
      await ConnectionService.refreshPresence(userId).catch(() => {});
    });

    // ── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      console.info(`[SocketServer] Disconnected userId=${userId} socketId=${socket.id} reason=${reason}`);
      await ConnectionService.disconnectUser(userId, socket.id);
    });

    
  });

  // Register io globally so SocketService can use it anywhere
  setIoInstance(io);

  console.info('[SocketServer] Initialized successfully');
  return io;
}

export function getIo(): AppServer {
  if (!io) throw new Error('[SocketServer] io not initialized. Call initializeSocketServer() first.');
  return io;
}
