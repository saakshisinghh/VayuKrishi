// src/lib/security.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import DOMPurify from "isomorphic-dompurify";

// ─── Secure Headers ───────────────────────────────────────────────────────────

export const SECURE_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=(self)",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    "connect-src 'self' https://api.vayukrishi.in https://sentry.io wss://api.vayukrishi.in",
    "frame-ancestors 'none'",
  ].join("; "),
};

export function applySecureHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// ─── Input Sanitization ───────────────────────────────────────────────────────

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // strip angle brackets
    .replace(/javascript:/gi, "") // strip JS protocol
    .replace(/on\w+=/gi, "") // strip event handlers
    .trim();
}

// ─── File Upload Validation ───────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_FILE_SIZE_MB = 10;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageUpload(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { valid: false, error: `Only JPEG, PNG, and WebP images are allowed. Got: ${file.type}` };
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File size must be under ${MAX_FILE_SIZE_MB}MB.` };
  }
  return { valid: true };
}

// ─── CSRF Token ───────────────────────────────────────────────────────────────

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function validateCSRFToken(token: string, stored: string): boolean {
  if (token.length !== stored.length) return false;
  // Constant-time comparison to prevent timing attacks
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  return mismatch === 0;
}

// ─── Rate Limiting (client-side guard) ───────────────────────────────────────

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// ─── Phone number masking ─────────────────────────────────────────────────────

export function maskPhone(phone: string): string {
  if (phone.length < 6) return "••••••";
  return phone.slice(0, 2) + "••••••" + phone.slice(-2);
}
