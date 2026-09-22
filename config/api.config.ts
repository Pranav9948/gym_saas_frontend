// ===========================================
// API Configuration
// ===========================================

// Base URL for API calls

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : 'http://localhost:5000/api/v1';

// Frontend URL for redirects
export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

// API Endpoints Map
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_GYM: '/auth/register-gym',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/generate-new-tokens',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  SUPER_ADMIN: {
    SETUP: '/super-admin/setup',
    LOGIN: '/super-admin/login',
    ME: '/super-admin/me',
    REFRESH: '/super-admin/rotate-refresh-token',
    LOGOUT: '/super-admin/logout',
    DASHBOARD: '/super-admin/dashboard',
    PLANS: {
      LIST: '/super-admin/plan/get-all-plans',
      CREATE: '/super-admin/plan/create-plan',
      GET: (id: string) => `/super-admin/plan/${id}`,
      UPDATE: (id: string) => `/super-admin/plan/update-plan/${id}`,
      DELETE: (id: string) => `/super-admin/plan/delete-plan/${id}`,
    },
  },

  // Members
  MEMBERS: {
    LIST: '/members',
    CREATE: '/members',
    GET: (id: string) => `/members/${id}`,
    UPDATE: (id: string) => `/members/${id}`,
    DELETE: (id: string) => `/members/${id}`,
    ATTENDANCE: (id: string) => `/members/${id}/attendance`,
    RENEWAL_REMINDER: (id: string) => `/members/${id}/renewal-reminder`,
    MARK_PAID: (id: string) => `/members/${id}/mark-paid`,
  },

  PACKAGES: {
    LIST: '/packages',
    CREATE: '/packages',
    UPDATE: (id: string) => `/packages/${id}`,
    DELETE: (id: string) => `/packages/${id}`,
  },

  // Trainers
  TRAINERS: {
    LIST: '/trainers',
    CREATE: '/trainers',
    GET: (id: string) => `/trainers/${id}`,
    UPDATE: (id: string) => `/trainers/${id}`,
    DELETE: (id: string) => `/trainers/${id}`,
    MEMBERS: (id: string) => `/trainers/${id}/members`,
    OVERVIEW: '/trainers/overview',
    PERFORMANCE: (id: string) => `/trainers/${id}/performance`,
  },

  // Attendance
  ATTENDANCE: {
    MARK: '/attendance',
    TODAY: '/attendance/today',
    HISTORY: '/attendance/history',
    STATS: (memberId: string) => `/attendance/stats/${memberId}`,
  },

  STAFF_ATTENDANCE: {
    METRICS: '/staff-attendance/metrics',
    MARK: '/staff-attendance',
    LIST: '/staff-attendance',
  },

  // Goals
  GOALS: {
    CREATE: (memberId: string) => `/goals/${memberId}`,
    LIST: (memberId: string) => `/goals/${memberId}`,
  },

  // Tenant
  TENANT: {
    GET: '/tenant',
    UPDATE: '/tenant',
    UPLOAD_LOGO: '/tenant/logo',
    LIST_USERS: '/tenant/users',
    LIST_INVITES: '/tenant/users/invites',
    INVITE_PREVIEW: '/tenant/users/invites/preview',
    CANCEL_INVITE: (id: string) => `/tenant/users/invites/${id}`,
    INVITE_USER: '/tenant/users/invite',
    ACCEPT_INVITE: '/tenant/users/accept-invite',
    CREATE_USER: '/tenant/users',
    UPGRADE_PLAN: '/tenant/upgrade-plan',
  },

  // RBAC
  RBAC: {
    PERMISSIONS: '/permissions',
    ROLES: {
      LIST: (tenantId: string) => `/tenants/${tenantId}/roles`,
      CREATE: (tenantId: string) => `/tenants/${tenantId}/roles`,
      UPDATE: (tenantId: string, roleId: string) =>
        `/tenants/${tenantId}/roles/${roleId}`,
      DELETE: (tenantId: string, roleId: string) =>
        `/tenants/${tenantId}/roles/${roleId}`,
    },
  },

  // Billing
  BILLING: {
    PLANS: '/billing/plans',
    SUBSCRIPTION: '/billing/subscription',
    SUMMARY: '/billing/summary',
    USAGE: '/billing/usage',
    PAYMENT_HISTORY: '/billing/payment-history',
    CHECKOUT_SESSION: '/billing/checkout-session',
    CREATE_CHECKOUT_SESSION: '/billing/create-checkout-session',
    CUSTOMER_PORTAL: '/billing/customer-portal',
    CREATE_PORTAL_SESSION: '/billing/create-portal-session',
  },

  // Health
  HEALTH: {
    CHECK: '/health',
    V1: '/api/v1/health',
  },
} as const;

// Request timeouts
export const TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  AUTH_REFRESH: 8000, // Fail fast when API is down during session restore
  UPLOAD: 60000, // 60 seconds for file uploads
  LONG: 120000, // 2 minutes for long operations
} as const;

// Rate limit info
export const RATE_LIMITS = {
  LOGIN: {
    MAX_ATTEMPTS: 5,
    WINDOW_MINUTES: 1,
  },
} as const;
