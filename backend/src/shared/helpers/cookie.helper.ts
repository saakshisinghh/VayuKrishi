/**
 * shared/helpers/cookie.helper.ts
 * ---------------------------------
 * Centralizes refresh-token cookie settings so login/register/otp-verify/
 * refresh/logout all use identical options (name, path, flags) — mismatched
 * options between "set" and "clear" calls are a classic way cookies fail
 * to actually get cleared.
 *
 * NOTE on `path`: this MUST be '/' (not scoped to '/api/v1/auth'). The
 * cookie is read by the Next.js frontend's middleware on page navigations
 * like `/en/overview` — completely unrelated paths on a different origin
 * (localhost:3000) than where it's set (localhost:5000). A cookie scoped
 * to '/api/v1/auth' is only ever sent back on requests to that exact path
 * prefix, so the frontend middleware never sees it and treats the user as
 * logged out even immediately after a successful login. Browsers DO still
 * store a narrow-path cookie (so it's visible in DevTools), which is what
 * made this bug easy to miss — it only fails at the "is this cookie sent
 * on this request" step, not the "was it set" step.
 */
import { Response } from 'express';
import { env, isProduction } from '../../config/env';
import { durationToSeconds } from './jwt.helper';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: durationToSeconds(env.JWT_REFRESH_EXPIRES_IN) * 1000,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}