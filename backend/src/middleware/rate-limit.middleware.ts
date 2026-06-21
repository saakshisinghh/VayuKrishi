/**
 * middleware/rate-limit.middleware.ts
 * ---------------------------------------
 * Two limiters:
 *  - generalLimiter: applied globally, generous limits, basic abuse protection.
 *  - authLimiter: applied only to sensitive auth endpoints (login/register/
 *    refresh) with much stricter limits to slow down brute-force/credential
 *    stuffing attempts.
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { buildErrorResponse } from '../shared/utils/api-response';
import { HttpStatus } from '../shared/constants/http-status';

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res
      .status(HttpStatus.TOO_MANY_REQUESTS)
      .json(buildErrorResponse('Too many requests. Please try again later.'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res
      .status(HttpStatus.TOO_MANY_REQUESTS)
      .json(buildErrorResponse('Too many authentication attempts. Please try again later.'));
  },
});
