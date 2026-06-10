// ─────────────────────────────────────────────────────────────────────────────
// src/components/auth/protected-route.tsx
// Wraps pages that require authentication
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthStore } from "@/store/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(`/${locale}/login`);
    }
  }, [isHydrated, isAuthenticated, router, locale]);

  if (!isHydrated) {
    return fallback ?? null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// src/components/auth/auth-guard.tsx
// Redirects authenticated users away from auth pages
// ─────────────────────────────────────────────────────────────────────────────

"use client";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(`/${locale}/overview`);
    }
  }, [isHydrated, isAuthenticated, router, locale]);

  if (isHydrated && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// src/components/auth/role-guard.tsx
// Renders children only if user has the required role/permission
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import type { UserRole, Permission } from "@/types/auth";
import { hasPermission, hasAnyPermission } from "@/lib/auth/permissions";
import { hasMinimumRole } from "@/lib/auth/roles";

interface RoleGuardProps {
  children: React.ReactNode;
  /** Require specific role(s) */
  roles?: UserRole[];
  /** Require minimum role level */
  minRole?: UserRole;
  /** Require a specific permission */
  permission?: Permission;
  /** Require any of these permissions */
  anyPermission?: Permission[];
  /** Rendered when access is denied */
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  roles,
  minRole,
  permission,
  anyPermission,
  fallback = null,
}: RoleGuardProps) {
  const { role } = useAuthStore();

  if (!role) return <>{fallback}</>;

  if (roles && !roles.includes(role)) return <>{fallback}</>;

  if (minRole && !hasMinimumRole(role, minRole)) return <>{fallback}</>;

  if (permission && !hasPermission(role, permission)) return <>{fallback}</>;

  if (anyPermission && !hasAnyPermission(role, anyPermission))
    return <>{fallback}</>;

  return <>{children}</>;
}
