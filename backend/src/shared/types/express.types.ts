/**
 * shared/types/express.types.ts
 * --------------------------------
 * Augments Express's Request type so `req.user` is type-safe wherever
 * the auth middleware has run, instead of using `any` or casting.
 */

import { UserRole } from '../enums/user.enums';

export interface AuthenticatedUserPayload {
  userId: string;
  role: UserRole;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}

export {};
