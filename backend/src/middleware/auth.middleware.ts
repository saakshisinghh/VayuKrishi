/**
 * middleware/auth.middleware.ts
 * ----------------------------------
 * Verifies the Bearer access token on protected routes and attaches
 * the decoded { userId, role } payload to req.user for downstream
 * handlers (and role.middleware.ts) to use.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../shared/helpers/jwt.helper';
import { ApiError } from '../shared/utils/api-error';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or malformed Authorization header');
    }

    const token = header.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('Access token not provided');
    }

    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    // Covers jwt.verify throwing TokenExpiredError / JsonWebTokenError
    next(ApiError.unauthorized('Invalid or expired access token'));
  }
}
