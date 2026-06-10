// ─────────────────────────────────────────────────────────────────────────────
// src/lib/auth/roles.ts
// Role definitions and hierarchy for Vayukrishi
// ─────────────────────────────────────────────────────────────────────────────

import type { UserRole } from "@/types/auth";

export interface RoleDefinition {
  key: UserRole;
  labelKey: string; // i18n key
  descriptionKey: string;
  level: number; // higher = more access
  color: string;
  icon: string;
}

export const ROLES: Record<UserRole, RoleDefinition> = {
  farmer: {
    key: "farmer",
    labelKey: "roles.farmer",
    descriptionKey: "roles.farmer_desc",
    level: 1,
    color: "emerald",
    icon: "🌱",
  },
  consultant: {
    key: "consultant",
    labelKey: "roles.consultant",
    descriptionKey: "roles.consultant_desc",
    level: 2,
    color: "blue",
    icon: "👨‍🌾",
  },
  fpo_manager: {
    key: "fpo_manager",
    labelKey: "roles.fpo_manager",
    descriptionKey: "roles.fpo_manager_desc",
    level: 3,
    color: "orange",
    icon: "🏢",
  },
  government_officer: {
    key: "government_officer",
    labelKey: "roles.government_officer",
    descriptionKey: "roles.government_officer_desc",
    level: 4,
    color: "purple",
    icon: "🏛️",
  },
  admin: {
    key: "admin",
    labelKey: "roles.admin",
    descriptionKey: "roles.admin_desc",
    level: 5,
    color: "red",
    icon: "⚡",
  },
};

export const ROLE_HIERARCHY: UserRole[] = [
  "farmer",
  "consultant",
  "fpo_manager",
  "government_officer",
  "admin",
];

/**
 * Returns true if `role` has at least the level of `requiredRole`
 */
export function hasMinimumRole(role: UserRole, requiredRole: UserRole): boolean {
  return ROLES[role].level >= ROLES[requiredRole].level;
}

/**
 * Returns roles that a user with `role` can manage
 */
export function getManageableRoles(role: UserRole): UserRole[] {
  const currentLevel = ROLES[role].level;
  return ROLE_HIERARCHY.filter((r) => ROLES[r].level < currentLevel);
}

/**
 * Register page role options (users self-select during registration)
 */
export const REGISTER_ROLE_OPTIONS: UserRole[] = [
  "farmer",
  "consultant",
  "fpo_manager",
];
