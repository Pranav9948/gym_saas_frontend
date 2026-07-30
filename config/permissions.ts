// ===========================================
// Permissions Configuration - RBAC
// ===========================================

import type { TenantRole } from '@/types';

// Permission constants matching backend
export const PERMISSIONS = {
  MEMBER: {
    CREATE: 'member:create',
    VIEW: 'member:view',
    UPDATE: 'member:update',
    DELETE: 'member:delete',
  },
  TRAINER: {
    CREATE: 'trainer:create',
    VIEW: 'trainer:view',
    UPDATE: 'trainer:update',
    DELETE: 'trainer:delete',
  },
  ATTENDANCE: {
    MARK: 'attendance:mark',
    VIEW: 'attendance:view',
  },
  TENANT: {
    VIEW: 'tenant:view',
    UPDATE: 'tenant:update',
  },
  USER: {
    INVITE: 'user:invite',
    UPDATE_ROLE: 'user:update-role',
    REMOVE: 'user:remove',
  },
  GOAL: {
    CREATE: 'goal:create',
    VIEW: 'goal:view',
  },
  ROLE: {
    CREATE: 'role:create',
    VIEW: 'role:view',
    UPDATE: 'role:update',
    DELETE: 'role:delete',
  },
} as const;

// All permissions as flat array
export const ALL_PERMISSIONS = [
  PERMISSIONS.MEMBER.CREATE,
  PERMISSIONS.MEMBER.VIEW,
  PERMISSIONS.MEMBER.UPDATE,
  PERMISSIONS.MEMBER.DELETE,
  PERMISSIONS.TRAINER.CREATE,
  PERMISSIONS.TRAINER.VIEW,
  PERMISSIONS.TRAINER.UPDATE,
  PERMISSIONS.TRAINER.DELETE,
  PERMISSIONS.ATTENDANCE.MARK,
  PERMISSIONS.ATTENDANCE.VIEW,
  PERMISSIONS.TENANT.VIEW,
  PERMISSIONS.TENANT.UPDATE,
  PERMISSIONS.USER.INVITE,
  PERMISSIONS.USER.UPDATE_ROLE,
  PERMISSIONS.USER.REMOVE,
  PERMISSIONS.GOAL.CREATE,
  PERMISSIONS.GOAL.VIEW,
  PERMISSIONS.ROLE.CREATE,
  PERMISSIONS.ROLE.VIEW,
  PERMISSIONS.ROLE.UPDATE,
  PERMISSIONS.ROLE.DELETE,
] as const;

// Role to permissions mapping (from backend seed)
export const ROLE_PERMISSIONS: Record<TenantRole, string[]> = {
  OWNER: [...ALL_PERMISSIONS],
  ADMIN: ALL_PERMISSIONS.filter(
    (p) =>
      p !== PERMISSIONS.USER.UPDATE_ROLE &&
      !p.startsWith('role:'),
  ),
  STAFF: [
    PERMISSIONS.MEMBER.CREATE,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEMBER.UPDATE,
    PERMISSIONS.ATTENDANCE.MARK,
    PERMISSIONS.ATTENDANCE.VIEW,
  ],
  TRAINER: [PERMISSIONS.MEMBER.VIEW, PERMISSIONS.ATTENDANCE.VIEW, PERMISSIONS.GOAL.VIEW],
};

// Get permissions for a role
export function getPermissionsForRole(role: TenantRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Check if role has permission
export function roleHasPermission(
  role: TenantRole,
  permission: string,
): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}

// Check if user has all required permissions
export function hasAllPermissions(
  userPermissions: string[],
  required: string[],
): boolean {
  return required.every((permission) => userPermissions.includes(permission));
}

// Check if user has any of the required permissions
export function hasAnyPermission(
  userPermissions: string[],
  required: string[],
): boolean {
  return required.some((permission) => userPermissions.includes(permission));
}

// Permission type for type safety
export type Permission = (typeof ALL_PERMISSIONS)[number];
