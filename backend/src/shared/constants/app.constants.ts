/**
 * shared/constants/app.constants.ts
 * -----------------------------------
 * Misc application-wide constants. Centralizing Redis key prefixes here
 * avoids typo-driven bugs when the same key pattern is used in multiple
 * services (e.g. auth.service.ts writing a refresh token and a future
 * session-management feature reading it).
 */

export const REDIS_KEYS = {
  refreshToken: (userId: string) => `refresh_token:${userId}`,
  otp: (mobile: string, purpose: string) => `otp:${purpose}:${mobile}`,
  pendingRegistration: (mobile: string) => `pending_registration:${mobile}`,
};

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
};
