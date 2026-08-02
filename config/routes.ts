// ===========================================
// Route Configuration - App routes & permissions
// ===========================================

import { PERMISSIONS } from './permissions';
import type { TenantRole } from '@/types';

// Route paths — aligned with App Router file structure under (dashboard)
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACCEPT_INVITE: '/accept-invite',

  // Error pages
  NOT_FOUND: '/not-found',
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',

  // Super Admin routes
  SUPER_ADMIN: '/super-admin',
  SUPER_ADMIN_PLANS: '/super-admin/plans',
  SUPER_ADMIN_GYMS: '/super-admin/gyms',
  SUPER_ADMIN_OWNERS: '/super-admin/owners',
  SUPER_ADMIN_BILLING: '/super-admin/billing',
  SUPER_ADMIN_ANALYTICS: '/super-admin/analytics',
  SUPER_ADMIN_SETTINGS: '/super-admin/settings',
  SUPER_ADMIN_LOGIN: '/super-admin/login',

  // Staff portal (STAFF / ADMIN / TRAINER)
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  MEMBER_NEW: '/members/new',
  MEMBER_DETAIL: (id: string) => `/members/${id}`,
  MEMBER_EDIT: (id: string) => `/members/${id}/edit`,

  TRAINERS: '/trainers',
  TRAINER_NEW: '/trainers/new',
  TRAINER_DETAIL: (id: string) => `/trainers/${id}`,
  TRAINER_EDIT: (id: string) => `/trainers/${id}/edit`,

  ATTENDANCE: '/attendance',
  ATTENDANCE_REPORTS: '/attendance/reports',

  ANALYTICS: '/analytics',
  ANALYTICS_MEMBERS: '/analytics/members',
  ANALYTICS_REVENUE: '/analytics/revenue',

  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_GYM: '/settings/gym',
  SETTINGS_TEAM: '/settings/team',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_ROLES: '/settings/roles',

  BILLING: '/billing',
  BILLING_UPGRADE: '/billing/upgrade',
  BILLING_INVOICES: '/billing/invoices',

  PROFILE: '/settings/profile',

  // Owner portal
  OWNER: '/owner/dashboard',
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_MEMBERS: '/owner/members',
  OWNER_BILLING: '/owner/billing',
  OWNER_SETTINGS: '/owner/settings',
  OWNER_SETTINGS_ROLES: '/owner/settings/roles',

  // Member portal (future — gym member self-service)
  MEMBER_PORTAL: '/member/dashboard',
  MEMBER_PROFILE: '/member/profile',
  MEMBER_ATTENDANCE: '/member/attendance',
} as const;

export const STAFF_PORTAL_ROLES: TenantRole[] = ['STAFF', 'ADMIN', 'TRAINER'];
export const OWNER_PORTAL_ROLES: TenantRole[] = ['OWNER'];
export const SUPER_ADMIN_ROLES = ['SUPER_ADMIN'] as const;

// Route permission mapping
export interface RouteConfig {
  path: string;
  permissions: string[];
  requireAuth: boolean;
  roles?: TenantRole[];
}

export const ROUTE_PERMISSIONS: Record<string, RouteConfig> = {
  [ROUTES.LOGIN]: { path: ROUTES.LOGIN, permissions: [], requireAuth: false },
  [ROUTES.REGISTER]: {
    path: ROUTES.REGISTER,
    permissions: [],
    requireAuth: false,
  },
  [ROUTES.FORGOT_PASSWORD]: {
    path: ROUTES.FORGOT_PASSWORD,
    permissions: [],
    requireAuth: false,
  },
  [ROUTES.RESET_PASSWORD]: {
    path: ROUTES.RESET_PASSWORD,
    permissions: [],
    requireAuth: false,
  },
  [ROUTES.ACCEPT_INVITE]: {
    path: ROUTES.ACCEPT_INVITE,
    permissions: [],
    requireAuth: false,
  },

  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    permissions: [],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },

  [ROUTES.MEMBERS]: {
    path: ROUTES.MEMBERS,
    permissions: [PERMISSIONS.MEMBER.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.MEMBER_NEW]: {
    path: ROUTES.MEMBER_NEW,
    permissions: [PERMISSIONS.MEMBER.CREATE],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },

  [ROUTES.TRAINERS]: {
    path: ROUTES.TRAINERS,
    permissions: [PERMISSIONS.TRAINER.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.TRAINER_NEW]: {
    path: ROUTES.TRAINER_NEW,
    permissions: [PERMISSIONS.TRAINER.CREATE],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },

  [ROUTES.ATTENDANCE]: {
    path: ROUTES.ATTENDANCE,
    permissions: [PERMISSIONS.ATTENDANCE.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.ATTENDANCE_REPORTS]: {
    path: ROUTES.ATTENDANCE_REPORTS,
    permissions: [PERMISSIONS.ATTENDANCE.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },

  [ROUTES.ANALYTICS]: {
    path: ROUTES.ANALYTICS,
    permissions: [PERMISSIONS.TENANT.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },

  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    permissions: [],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.SETTINGS_PROFILE]: {
    path: ROUTES.SETTINGS_PROFILE,
    permissions: [],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.SETTINGS_GYM]: {
    path: ROUTES.SETTINGS_GYM,
    permissions: [PERMISSIONS.TENANT.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.SETTINGS_TEAM]: {
    path: ROUTES.SETTINGS_TEAM,
    permissions: [PERMISSIONS.TENANT.UPDATE],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.SETTINGS_ROLES]: {
    path: ROUTES.SETTINGS_ROLES,
    permissions: [PERMISSIONS.ROLE.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },

  [ROUTES.BILLING]: {
    path: ROUTES.BILLING,
    permissions: [PERMISSIONS.TENANT.VIEW],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },
  [ROUTES.BILLING_UPGRADE]: {
    path: ROUTES.BILLING_UPGRADE,
    permissions: [PERMISSIONS.TENANT.UPDATE],
    requireAuth: true,
    roles: STAFF_PORTAL_ROLES,
  },

  [ROUTES.MEMBER_PORTAL]: {
    path: ROUTES.MEMBER_PORTAL,
    permissions: [],
    requireAuth: true,
  },
};

export function getRouteConfig(pathname: string): RouteConfig | null {
  const normalized = pathname.split('?')[0];

  const exact = ROUTE_PERMISSIONS[normalized];
  if (exact) return exact;

  const matches = Object.values(ROUTE_PERMISSIONS)
    .filter(
      (config) =>
        normalized === config.path || normalized.startsWith(`${config.path}/`),
    )
    .sort((a, b) => b.path.length - a.path.length);

  return matches[0] ?? null;
}

export function canAccessRoute(
  routePath: string,
  userPermissions: string[],
  userRole?: string,
): boolean {
  const routeConfig = getRouteConfig(routePath);

  if (!routeConfig) {
    return true;
  }

  if (!routeConfig.requireAuth) {
    return true;
  }

  if (routeConfig.roles?.length && userRole) {
    if (!routeConfig.roles.includes(userRole as TenantRole)) {
      return false;
    }
  }

  if (routeConfig.permissions.length === 0) {
    return true;
  }

  return routeConfig.permissions.every((permission) =>
    userPermissions.includes(permission),
  );
}

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.ACCEPT_INVITE,
  ROUTES.UNAUTHORIZED,
  ROUTES.FORBIDDEN,
];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}?`),
  );
}

export function isStaffPortalRoute(pathname: string): boolean {
  const staffPrefixes = [
    ROUTES.DASHBOARD,
    ROUTES.MEMBERS,
    ROUTES.TRAINERS,
    ROUTES.ATTENDANCE,
    ROUTES.ANALYTICS,
    ROUTES.SETTINGS,
    ROUTES.BILLING,
  ];

  return staffPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isOwnerPortalRoute(pathname: string): boolean {
  return pathname === '/owner' || pathname.startsWith('/owner/');
}

export function isSuperAdminRoute(pathname: string): boolean {
  return (
    pathname === ROUTES.SUPER_ADMIN ||
    pathname.startsWith(`${ROUTES.SUPER_ADMIN}/`)
  );
}

export function isMemberPortalRoute(pathname: string): boolean {
  return pathname === '/member' || pathname.startsWith('/member/');
}

export function getPostLoginRoute(role?: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return ROUTES.SUPER_ADMIN_PLANS;
    case 'OWNER':
      return ROUTES.OWNER_DASHBOARD;
    case 'TRAINER':
      return ROUTES.ATTENDANCE;
    case 'ADMIN':
    case 'STAFF':
      return ROUTES.DASHBOARD;
    case 'MEMBER':
    case 'CLIENT':
      return ROUTES.MEMBER_PORTAL;
    default:
      return ROUTES.DASHBOARD;
  }
}

export function getForbiddenRedirect(role?: string): string {
  if (!role) return ROUTES.UNAUTHORIZED;
  if (role === 'SUPER_ADMIN') return ROUTES.SUPER_ADMIN;
  if (role === 'OWNER') return ROUTES.OWNER_DASHBOARD;
  if (role === 'MEMBER' || role === 'CLIENT') return ROUTES.MEMBER_PORTAL;
  if (STAFF_PORTAL_ROLES.includes(role as TenantRole)) return ROUTES.DASHBOARD;
  return ROUTES.FORBIDDEN;
}
