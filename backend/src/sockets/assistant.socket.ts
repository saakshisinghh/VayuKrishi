import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  AssistantMessagePayload,
} from './socket.types';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

// Active streaming sessions (in-memory; replace with Redis for multi-node)
const activeSessions = new Map<string, NodeJS.Timeout>();

/**
 * Mock LLM streaming — replace this with a real SSE/WebSocket call
 * to your FastAPI AI service when Phase 12 is ready.
 *
 *   Frontend → Socket.io → Backend (here)
 *                             ↓
 *                         FastAPI AI Service
 *                             ↓
 *                         Streaming LLM (OpenAI / Llama / etc.)
 *                             ↓  (chunked SSE / websocket)
 *                         Backend forwards each token
 *                             ↓
 *                         socket.emit('assistant:stream', chunk)
 */
async function streamMockResponse(
  socket: AuthenticatedSocket,
  sessionId: string,
  userMessage: string
): Promise<void> {
  // In production: POST to http://ai-service/chat/stream and pipe tokens back
  const mockReply = `Namaste! You asked: "${userMessage}". I am your Vayukrishi farming assistant. Here are my recommendations based on your query...`;
  const tokens = mockReply.split(' ');

  let index = 0;

  const interval = setInterval(() => {
    if (index >= tokens.length) {
      clearInterval(interval);
      activeSessions.delete(sessionId);
      socket.emit('assistant:end', sessionId);
      return;
    }

    const isLast = index === tokens.length - 1;
    socket.emit('assistant:stream', {
      sessionId,
      token: tokens[index] + (isLast ? '' : ' '),
      isLast,
    });

    index++;
  }, 60); // ~60ms per token → ~16 tokens/sec

  activeSessions.set(sessionId, interval);
}

export function registerAssistantSocket(io: AppServer, socket: AuthenticatedSocket): void {
  const { _id: userId } = socket.user;

  // ── assistant:start ───────────────────────────────────────
  socket.on('assistant:start', async (payload: AssistantMessagePayload) => {
    try {
      const { sessionId, message, language = 'en' } = payload;

      if (!sessionId || !message) {
        socket.emit('error', { message: 'sessionId and message are required', code: 'ASSISTANT_INVALID_PAYLOAD' });
        return;
      }

      // Cancel any existing session for this socket
      const existing = activeSessions.get(sessionId);
      if (existing) {
        clearInterval(existing);
        activeSessions.delete(sessionId);
      }

      console.info(`[AssistantSocket] userId=${userId} session=${sessionId} lang=${language} started`);
      await streamMockResponse(socket, sessionId, message);
    } catch (err) {
      console.error('[AssistantSocket] assistant:start error', err);
      socket.emit('error', { message: 'Failed to start assistant session', code: 'ASSISTANT_START_FAILED' });
    }
  });

  // ── assistant:message (follow-up in same session) ─────────
  socket.on('assistant:message', async (payload: AssistantMessagePayload) => {
    try {
      const { sessionId, message } = payload;
      if (!sessionId || !message) return;
      console.info(`[AssistantSocket] userId=${userId} session=${sessionId} follow-up`);
      await streamMockResponse(socket, sessionId, message);
    } catch (err) {
      console.error('[AssistantSocket] assistant:message error', err);
    }
  });

  // ── assistant:cancel ──────────────────────────────────────
  socket.on('assistant:cancel', (sessionId: string) => {
    const timer = activeSessions.get(sessionId);
    if (timer) {
      clearInterval(timer);
      activeSessions.delete(sessionId);
      socket.emit('assistant:end', sessionId);
      console.info(`[AssistantSocket] userId=${userId} session=${sessionId} cancelled`);
    }
  });

  // ── Cleanup on disconnect ─────────────────────────────────
  socket.on('disconnect', () => {
    for (const [sessionId, timer] of activeSessions.entries()) {
      clearInterval(timer);
      activeSessions.delete(sessionId);
    }
  });
}
