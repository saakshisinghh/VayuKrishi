import { Socket } from 'socket.io';

export interface AuthenticatedUser {
  _id: string;
  role: 'farmer' | 'consultant' | 'fpo_manager' | 'admin' | 'govt_officer';
  name: string;
  email: string;
}

export interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUser;
}

export interface UserPresence {
  userId: string;
  socketIds: string[];
  role: string;
  connectedAt: string;
  lastSeen: string;
  isOnline: boolean;
}

// ── Notification Events ───────────────────────────────────────
export interface NotificationPayload {
  notificationId: string;
  title: string;
  message: string;
  type:
    | 'info'
    | 'warning'
    | 'alert'
    | 'disease_alert'
    | 'market_update'
    | 'scheme_alert'
    | 'job_status';
  priority: 'low' | 'medium' | 'high' | 'critical';
  data?: Record<string, unknown>;
  createdAt: string;
}

// ── Market Events ─────────────────────────────────────────────
export interface MarketUpdatePayload {
  commodity: string;
  state: string;
  market: string;
  pricePerQuintal: number;
  previousPrice?: number;
  changePercent?: number;
  updatedAt: string;
}

export interface PriceAlertPayload {
  commodity: string;
  alertType: 'surge' | 'drop' | 'threshold';
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  message: string;
}

// ── Assistant Events ──────────────────────────────────────────
export interface AssistantMessagePayload {
  sessionId: string;
  message: string;
  language?: string; // hi, mr, pa, en etc.
}

export interface AssistantStreamChunk {
  sessionId: string;
  token: string;
  isLast: boolean;
}

// ── Analytics Events ──────────────────────────────────────────
export interface AnalyticsUpdatePayload {
  metric: string;
  value: number;
  delta?: number;
  timestamp: string;
}

// ── Job Status Events ─────────────────────────────────────────
export interface JobStatusPayload {
  jobId: string;
  jobType: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: unknown;
  error?: string;
}

// ── Server-to-client event map ────────────────────────────────
export interface ServerToClientEvents {
  'notification:new': (payload: NotificationPayload) => void;
  'notification:read': (notificationId: string) => void;
  'notification:all-read': () => void;
  'market:update': (payload: MarketUpdatePayload) => void;
  'market:price-alert': (payload: PriceAlertPayload) => void;
  'assistant:stream': (chunk: AssistantStreamChunk) => void;
  'assistant:end': (sessionId: string) => void;
  'analytics:update': (payload: AnalyticsUpdatePayload) => void;
  'dashboard:refresh': () => void;
  'job:status': (payload: JobStatusPayload) => void;
  error: (payload: { message: string; code?: string }) => void;
  pong: (ts: number) => void;
}

// ── Client-to-server event map ────────────────────────────────
export interface ClientToServerEvents {
  'notification:read': (notificationId: string) => void;
  'notification:all-read': () => void;
  'notification:test': () => void;
  'market:subscribe': (commodity: string) => void;
  'market:unsubscribe': (commodity: string) => void;
  'assistant:start': (payload: AssistantMessagePayload) => void;
  'assistant:message': (payload: AssistantMessagePayload) => void;
  'assistant:cancel': (sessionId: string) => void;
  'analytics:subscribe': () => void;
  ping: () => void;
}

// ── Inter-server events (Redis pub/sub) ───────────────────────
export interface InterServerEvents {
  'user:connected': (userId: string, socketId: string) => void;
  'user:disconnected': (userId: string, socketId: string) => void;
}

// ── Socket data ───────────────────────────────────────────────
export interface SocketData {
  user: AuthenticatedUser;
}
