// ─────────────────────────────────────────────────────────────────────────────
// src/lib/auth/permissions.ts
// Permission matrix for Vayukrishi roles
// ─────────────────────────────────────────────────────────────────────────────

import type { Permission, RolePermissions, UserRole } from "@/types/auth";

export const ROLE_PERMISSIONS: RolePermissions = {
  farmer: [
    "view:dashboard",
    "view:crop_recommendation",
    "view:disease_detection",
    "view:assistant",
    "view:market",
    "view:farm_health",
    "view:planner",
    "view:schemes",
    "edit:farm_data",
  ],

  consultant: [
    "view:dashboard",
    "view:crop_recommendation",
    "view:disease_detection",
    "view:assistant",
    "view:market",
    "view:farm_health",
    "view:planner",
    "view:schemes",
    "view:analytics",
    "view:all_farms",
    "edit:farm_data",
    "manage:farmers",
  ],

  fpo_manager: [
    "view:dashboard",
    "view:crop_recommendation",
    "view:disease_detection",
    "view:assistant",
    "view:market",
    "view:farm_health",
    "view:planner",
    "view:schemes",
    "view:analytics",
    "view:all_farms",
    "manage:farmers",
    "manage:fpo",
    "approve:applications",
    "generate:reports",
  ],

  government_officer: [
    "view:dashboard",
    "view:crop_recommendation",
    "view:market",
    "view:analytics",
    "view:all_farms",
    "view:schemes",
    "manage:schemes",
    "approve:applications",
    "generate:reports",
  ],

  admin: [
    "view:dashboard",
    "view:crop_recommendation",
    "view:disease_detection",
    "view:assistant",
    "view:market",
    "view:farm_health",
    "view:planner",
    "view:schemes",
    "view:analytics",
    "view:all_farms",
    "edit:farm_data",
    "manage:users",
    "manage:farmers",
    "manage:consultants",
    "manage:fpo",
    "manage:schemes",
    "manage:system",
    "approve:applications",
    "generate:reports",
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has ALL listed permissions
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the listed permissions
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
