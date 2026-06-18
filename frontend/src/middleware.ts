// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts
// Handles: Locale detection | Auth route protection | Public/protected routing
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

// next-intl middleware handles locale prefix routing
const intlMiddleware = createMiddleware(routing);

// ─── Route Classification ─────────────────────────────────────────────────────

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/pricing",
];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/otp",
  "/forgot-password",
];

/**
 * Strip locale prefix from pathname
 * e.g. /en/login → /login, /mr/overview → /overview
 */
function stripLocale(pathname: string, locales: string[]): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locales = routing.locales as unknown as string[];

  const strippedPath = stripLocale(pathname, locales);

  // ─── Static & API passthrough ─────────────────────────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ─── Check for refresh token cookie (presence = likely authenticated) ──────
  // NOTE: We cannot verify JWT in edge middleware without the secret being
  // edge-compatible. We use the cookie presence as a soft signal. The actual
  // token validation happens in the AuthProvider client-side.
  const hasRefreshToken = request.cookies.has("refresh_token");

  // ─── Redirect unauthenticated users away from protected routes ────────────
  const isPublic = PUBLIC_ROUTES.some(
    (r) => strippedPath === r || strippedPath.startsWith(r + "/")
  );
  const isAuth = AUTH_ROUTES.some(
    (r) => strippedPath === r || strippedPath.startsWith(r)
  );

  if (!isPublic && !isAuth && !hasRefreshToken) {
    const locale = locales.find((l) => pathname.startsWith(`/${l}`)) ?? routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Redirect authenticated users away from auth pages ───────────────────
  if (isAuth && hasRefreshToken) {
    const locale =
      locales.find((l) => pathname.startsWith(`/${l}`)) ?? routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/overview`, request.url));
  }

  // ─── Run next-intl middleware for locale handling ─────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next internals
    "/((?!_next/static|_next/image|favicon.ico|icons|images).*)",
  ],
};
