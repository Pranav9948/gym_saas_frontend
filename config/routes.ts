// ===========================================
// Route Configuration - App routes & permissions
// ===========================================

import { PERMISSIONS } from './permissions';

// Route paths
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACCEPT_INVITE: '/accept-invite',

  // superadmin  routes

  SUPER_ADMIN: '/super-admin',
  SUPER_ADMIN_PLANS: '/super-admin/plans',
  SUPER_ADMIN_GYMS: '/super-admin/gyms',
  SUPER_ADMIN_OWNERS: '/super-admin/owners',
  SUPER_ADMIN_BILLING: '/super-admin/billing',
  SUPER_ADMIN_ANALYTICS: '/super-admin/analytics',
  SUPER_ADMIN_SETTINGS: '/super-admin/settings',

  PROFILE: '/settings/profile',

  // Dashboard routes
  DASHBOARD: '/dashboard',

  // Members
  MEMBERS: '/dashboard/members',
  MEMBER_NEW: '/dashboard/members/new',
  MEMBER_DETAIL: (id: string) => `/dashboard/members/${id}`,
  MEMBER_EDIT: (id: string) => `/dashboard/members/${id}/edit`,

  SUPER_ADMIN_LOGIN: '/super-admin/login',

  // Trainers
  TRAINERS: '/dashboard/trainers',
  TRAINER_NEW: '/dashboard/trainers/new',
  TRAINER_DETAIL: (id: string) => `/dashboard/trainers/${id}`,
  TRAINER_EDIT: (id: string) => `/dashboard/trainers/${id}/edit`,

  // Attendance
  ATTENDANCE: '/dashboard/attendance',
  ATTENDANCE_REPORTS: '/dashboard/attendance/reports',

  // Analytics
  ANALYTICS: '/dashboard/analytics',
  ANALYTICS_MEMBERS: '/dashboard/analytics/members',
  ANALYTICS_REVENUE: '/dashboard/analytics/revenue',

  // Settings
  SETTINGS: '/dashboard/settings',
  SETTINGS_PROFILE: '/dashboard/settings/profile',
  SETTINGS_GYM: '/dashboard/settings/gym',
  SETTINGS_TEAM: '/dashboard/settings/team',
  SETTINGS_NOTIFICATIONS: '/dashboard/settings/notifications',

  // Billing
  BILLING: '/dashboard/billing',
  BILLING_UPGRADE: '/dashboard/billing/upgrade',
  BILLING_INVOICES: '/dashboard/billing/invoices',
} as const;

// Route permission mapping
export interface RouteConfig {
  path: string;
  permissions: string[];
  requireAuth: boolean;
}

export const ROUTE_PERMISSIONS: Record<string, RouteConfig> = {
  // Public routes
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

  // Dashboard
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    permissions: [],
    requireAuth: true,
  },

  // Members - anyone with member:view can access
  [ROUTES.MEMBERS]: {
    path: ROUTES.MEMBERS,
    permissions: [PERMISSIONS.MEMBER.VIEW],
    requireAuth: true,
  },
  [ROUTES.MEMBER_NEW]: {
    path: ROUTES.MEMBER_NEW,
    permissions: [PERMISSIONS.MEMBER.CREATE],
    requireAuth: true,
  },

  // Trainers
  [ROUTES.TRAINERS]: {
    path: ROUTES.TRAINERS,
    permissions: [PERMISSIONS.TRAINER.VIEW],
    requireAuth: true,
  },
  [ROUTES.TRAINER_NEW]: {
    path: ROUTES.TRAINER_NEW,
    permissions: [PERMISSIONS.TRAINER.CREATE],
    requireAuth: true,
  },

  // Attendance
  [ROUTES.ATTENDANCE]: {
    path: ROUTES.ATTENDANCE,
    permissions: [PERMISSIONS.ATTENDANCE.VIEW],
    requireAuth: true,
  },
  [ROUTES.ATTENDANCE_REPORTS]: {
    path: ROUTES.ATTENDANCE_REPORTS,
    permissions: [PERMISSIONS.ATTENDANCE.VIEW],
    requireAuth: true,
  },

  // Settings
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    permissions: [],
    requireAuth: true,
  },
  [ROUTES.SETTINGS_PROFILE]: {
    path: ROUTES.SETTINGS_PROFILE,
    permissions: [],
    requireAuth: true,
  },
  [ROUTES.SETTINGS_GYM]: {
    path: ROUTES.SETTINGS_GYM,
    permissions: [PERMISSIONS.TENANT.VIEW],
    requireAuth: true,
  },
  [ROUTES.SETTINGS_TEAM]: {
    path: ROUTES.SETTINGS_TEAM,
    permissions: [PERMISSIONS.TENANT.UPDATE],
    requireAuth: true,
  },

  // Billing
  [ROUTES.BILLING]: {
    path: ROUTES.BILLING,
    permissions: [PERMISSIONS.TENANT.VIEW],
    requireAuth: true,
  },
  [ROUTES.BILLING_UPGRADE]: {
    path: ROUTES.BILLING_UPGRADE,
    permissions: [PERMISSIONS.TENANT.UPDATE],
    requireAuth: true,
  },
};

// Helper to check if user can access route
export function canAccessRoute(
  routePath: string,
  userPermissions: string[],
): boolean {
  const routeConfig = ROUTE_PERMISSIONS[routePath];

  // If no config, default to requiring auth only
  if (!routeConfig) {
    return true;
  }

  // Public route
  if (!routeConfig.requireAuth) {
    return true;
  }

  // No specific permissions required
  if (routeConfig.permissions.length === 0) {
    return true;
  }

  // Check all required permissions
  return routeConfig.permissions.every((permission) =>
    userPermissions.includes(permission),
  );
}

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.ACCEPT_INVITE,
];

// Check if route is public
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}?`),
  );
}
