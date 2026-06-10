// ─────────────────────────────────────────────────────────────────────────────
// src/providers/auth-provider.tsx
// Handles session restore, token refresh, and session expiry events
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthStore } from "@/store/auth-store";

const PUBLIC_PATHS = ["/login", "/register", "/otp", "/forgot-password"];
const AUTH_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (before 15min expiry)

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { refreshSession, logout, isHydrated, isAuthenticated } = useAuthStore();
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.includes(p));

  // ─── Initial Session Restore ───────────────────────────────────────────────
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

  // ─── Session Expired Event ─────────────────────────────────────────────────
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

    if (isAuthenticated && isPublicPath) {
      router.push(`/${locale}/overview`);
    }
  }, [isHydrated, isAuthenticated, isPublicPath, pathname, router, locale]);

  return <>{children}</>;
}
