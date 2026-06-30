import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthenticatedSocket, AuthenticatedUser } from '../socket.types';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET as string;

/**
 * Socket.io authentication middleware.
 * Reads JWT from handshake.auth.token OR handshake.headers.authorization.
 * Attaches decoded user to socket.user on success.
 * Calls next(Error) to reject unauthorized connections.
 */
export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
): void {
  try {
    // Support both auth.token and Authorization header (Bearer scheme)
    const raw: string | undefined =
      socket.handshake.auth?.token ??
      (socket.handshake.headers.authorization?.startsWith('Bearer ')
        ? socket.handshake.headers.authorization.slice(7)
        : undefined);

    if (!raw) {
      console.warn(`[SocketAuth] No token provided. socketId=${socket.id}`);
      return next(new Error('AUTH_MISSING_TOKEN'));
    }

    const decoded = jwt.verify(raw, JWT_SECRET) as AuthenticatedUser & {
      iat: number;
      exp: number;
    };

   const userId = (decoded as any).userId ?? (decoded as any)._id;

if (!userId || !decoded.role) {
  return next(new Error('AUTH_INVALID_PAYLOAD'));
}

(socket as AuthenticatedSocket).user = {
  _id: userId,
  role: decoded.role,
  name: (decoded as any).name ?? '',
  email: (decoded as any).email ?? '',
};

  console.info(
      `[SocketAuth] Authenticated userId=${userId} role=${decoded.role} socketId=${socket.id}`
    );

    next();
  } catch (err) {
  console.error(`[SocketAuth] RAW ERROR socketId=${socket.id}:`, err);
  const message =
    err instanceof jwt.TokenExpiredError
      ? 'AUTH_TOKEN_EXPIRED'
      : 'AUTH_TOKEN_INVALID';
  next(new Error(message));
}
}

/**
 * Role guard factory for socket event handlers.
 * Usage: if (!requireSocketRole(socket, 'admin')) return;
 */
export function requireSocketRole(
  socket: AuthenticatedSocket,
  ...roles: AuthenticatedUser['role'][]
): boolean {
  if (!roles.includes(socket.user.role)) {
    socket.emit('error', {
      message: 'Insufficient permissions',
      code: 'FORBIDDEN',
    });
    return false;
  }
  return true;
}
