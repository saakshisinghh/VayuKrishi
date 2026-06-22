// ─────────────────────────────────────────────────────────────────────────────
// src/providers/auth-provider.tsx
// Handles session restore, token refresh, and session expiry events
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthStore } from "@/store/auth-store";

// NOTE: matched against the pathname with the locale prefix already
// stripped (see stripLocalePrefix below) — keep this in sync with
// middleware.ts's own PUBLIC_ROUTES/AUTH_ROUTES lists, since both files
// independently decide what counts as "doesn't require login".
const PUBLIC_PATHS = ["/", "/login", "/register", "/otp", "/forgot-password"];
const AUTH_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (before 15min expiry)

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Strips the leading /{locale} segment so path comparisons below don't
 * need to know about locales at all, and so "/" really means the home
 * page rather than every locale-root path failing to match "/".
 */
function stripLocalePrefix(pathname: string, locale: string): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { refreshSession, logout, isHydrated, isAuthenticated } = useAuthStore();
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const strippedPath = stripLocalePrefix(pathname, locale);
  // Exact match for "/", prefix match for everything else — avoids a
  // path like "/blog/forgot-password-tips" incorrectly counting as the
  // "/forgot-password" auth page via a loose .includes() check.
  const isPublicPath = PUBLIC_PATHS.some((p) =>
    p === "/" ? strippedPath === "/" : strippedPath === p || strippedPath.startsWith(`${p}/`)
  );

  // ─── Initial Session Restore ────────────────────────────────────────────────
  useEffect(() => {
    refreshSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auto-Refresh Token ────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      refreshIntervalRef.current = setInterval(() => {
        refreshSession();
      }, AUTH_REFRESH_INTERVAL);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuthenticated, refreshSession]);

  // ─── Session Expired Event ────────────────────────────────────────────────
  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
      router.push(`/${locale}/login?expired=true`);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [logout, router, locale]);

  // ─── Redirect Logic ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated && !isPublicPath) {
      router.push(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
    }

    // Only bounce logged-in users off the AUTH pages (login/register/otp/
    // forgot-password) — NOT off the home page "/". A logged-in user should
    // still be able to view the marketing/landing page if they navigate to it.
    const isAuthOnlyPath = isPublicPath && strippedPath !== "/";
    if (isAuthenticated && isAuthOnlyPath) {
      router.push(`/${locale}/overview`);
    }
  }, [isHydrated, isAuthenticated, isPublicPath, strippedPath, pathname, router, locale]);

  return <>{children}</>;
}