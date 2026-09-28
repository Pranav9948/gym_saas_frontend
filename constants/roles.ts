// ===========================================
// Role Constants
// ===========================================

import type { TenantRole } from '@/types';

export const ROLES: Record<string, TenantRole> = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  TRAINER: 'TRAINER',
} as const;

export const ROLE_LABELS: Record<TenantRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  STAFF: 'Staff',
  TRAINER: 'Trainer',
  MEMBER: 'Member',
} as const;

export const ROLE_DESCRIPTIONS: Record<TenantRole, string> = {
  OWNER: 'Full access to all features and settings',
  ADMIN: 'Can manage members, trainers, and attendance',
  STAFF: 'Can manage members and mark attendance',
  TRAINER: 'Can view members and attendance',
  MEMBER: 'Can view personal training and log workouts',
} as const;

// Roles that can be invited (OWNER cannot be invited)
export const INVITABLE_ROLES: TenantRole[] = ['ADMIN', 'STAFF'] as const;

// Roles that can be created directly with a password
export const DIRECT_CREATABLE_ROLES: TenantRole[] = [
  'ADMIN',
  'STAFF',
  'TRAINER',
] as const;

// Role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY: TenantRole[] = [
  'MEMBER',
  'TRAINER',
  'STAFF',
  'ADMIN',
  'OWNER',
] as const;

// Check if role A is higher than role B
export function isRoleHigherThan(
  roleA: TenantRole,
  roleB: TenantRole,
): boolean {
  const indexA = ROLE_HIERARCHY.indexOf(roleA);
  const indexB = ROLE_HIERARCHY.indexOf(roleB);
  return indexA > indexB;
}

// Check if role A is at least as high as role B
export function isRoleAtLeast(roleA: TenantRole, roleB: TenantRole): boolean {
  const indexA = ROLE_HIERARCHY.indexOf(roleA);
  const indexB = ROLE_HIERARCHY.indexOf(roleB);
  return indexA >= indexB;
}
