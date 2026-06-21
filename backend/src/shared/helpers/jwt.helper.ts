/**
 * shared/helpers/jwt.helper.ts
 * -------------------------------
 * Wraps jsonwebtoken to provide typed, single-purpose functions for
 * generating and verifying the two token types used by the auth module:
 *  - Access Token  (short-lived, 15m default, sent on every request)
 *  - Refresh Token (long-lived, 7d default, used only to mint new access
 *    tokens; stored server-side in Redis so it can be revoked on logout)
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { UserRole } from '../enums/user.enums';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export function generateAccessToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function generateRefreshToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

/**
 * Converts a duration string like "7d" / "15m" into seconds, so it can be
 * used directly as a Redis TTL (EX option). Supports d/h/m/s suffixes.
 */
export function durationToSeconds(duration: string): number {
  const match = /^(\d+)([dhms])$/.exec(duration);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = { d: 86400, h: 3600, m: 60, s: 1 };
  return value * multipliers[unit];
}
