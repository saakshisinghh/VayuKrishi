import { Server } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '../socket.types';
import { ConnectionService } from './connection.service';

type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

let _io: AppServer | null = null;

export function setIoInstance(io: AppServer): void {
  _io = io;
}

function io(): AppServer {
  if (!_io) throw new Error('[SocketService] io not initialized. Call setIoInstance() first.');
  return _io;
}

// ── SocketService ─────────────────────────────────────────────
export const SocketService = {
  /**
   * Emit an event to all active sockets of a specific user.
   * Handles multi-tab / multi-device transparently.
   */
  async emitToUser<K extends keyof ServerToClientEvents>(
    userId: string,
    event: K,
    payload: Parameters<ServerToClientEvents[K]>[0]
  ): Promise<void> {
    // Prefer private room (user:{userId}) — works across Redis adapter nodes
   io().to(`user:${userId}`).emit(event as any, payload);
    console.debug(`[SocketService] emitToUser userId=${userId} event=${String(event)}`);
  },

  /**
   * Emit to a named room (e.g. commodity:wheat, role:admin).
   */
  emitToRoom<K extends keyof ServerToClientEvents>(
    room: string,
    event: K,
    payload: Parameters<ServerToClientEvents[K]>[0]
  ): void {
    io().to(room).emit(event as any, payload);
    console.debug(`[SocketService] emitToRoom room=${room} event=${String(event)}`);
  },

  /**
   * Broadcast to every connected socket (platform-wide).
   */
  broadcast<K extends keyof ServerToClientEvents>(
    event: K,
    payload: Parameters<ServerToClientEvents[K]>[0]
  ): void {
    io().emit(event as any, payload);
    console.debug(`[SocketService] broadcast event=${String(event)}`);
  },

  /**
   * Make a socket join a room.
   */
  async joinRoom(socketId: string, room: string): Promise<void> {
    const socket = io().sockets.sockets.get(socketId);
    if (socket) {
      await socket.join(room);
      console.debug(`[SocketService] socketId=${socketId} joined room=${room}`);
    }
  },

  /**
   * Make a socket leave a room.
   */
  async leaveRoom(socketId: string, room: string): Promise<void> {
    const socket = io().sockets.sockets.get(socketId);
    if (socket) {
      await socket.leave(room);
      console.debug(`[SocketService] socketId=${socketId} left room=${room}`);
    }
  },

  /**
   * Emit a real-time notification — primary integration point for Phase 9.
   */
  async sendNotification(
    userId: string,
    payload: Parameters<ServerToClientEvents['notification:new']>[0]
  ): Promise<void> {
    await SocketService.emitToUser(userId, 'notification:new', payload);
  },

  /**
   * Emit a market price update to commodity subscribers.
   */
  sendMarketUpdate(
    commodity: string,
    payload: Parameters<ServerToClientEvents['market:update']>[0]
  ): void {
    SocketService.emitToRoom(`commodity:${commodity.toLowerCase()}`, 'market:update', payload);
  },

  /**
   * Broadcast a disease alert to a state room and optionally a role room.
   */
  sendDiseaseAlert(
    state: string,
    payload: Parameters<ServerToClientEvents['notification:new']>[0]
  ): void {
    SocketService.emitToRoom(`state:${state.toLowerCase()}`, 'notification:new', payload);
    SocketService.emitToRoom('role:admin', 'notification:new', payload);
  },

  /**
   * Broadcast a scheme alert to a state room.
   */
  sendSchemeAlert(
    state: string,
    payload: Parameters<ServerToClientEvents['notification:new']>[0]
  ): void {
    SocketService.emitToRoom(`state:${state.toLowerCase()}`, 'notification:new', payload);
  },

  /**
   * Emit a job progress update to the owning user.
   */
  async sendJobStatus(
    userId: string,
    payload: Parameters<ServerToClientEvents['job:status']>[0]
  ): Promise<void> {
    await SocketService.emitToUser(userId, 'job:status', payload);
  },

  /**
   * Trigger admin dashboard refresh.
   */
  refreshAdminDashboard(): void {
    SocketService.emitToRoom('role:admin', 'dashboard:refresh', undefined as never);
  },

  /**
   * Check if a user is currently online.
   */
  async isUserOnline(userId: string): Promise<boolean> {
    const presence = await ConnectionService.getUserPresence(userId);
    return presence?.isOnline ?? false;
  },

  getIo(): AppServer {
    return io();
  },
};
