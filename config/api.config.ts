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
  },

  // Trainers
  TRAINERS: {
    LIST: '/trainers',
    CREATE: '/trainers',
    GET: (id: string) => `/trainers/${id}`,
    UPDATE: (id: string) => `/trainers/${id}`,
    DELETE: (id: string) => `/trainers/${id}`,
    MEMBERS: (id: string) => `/trainers/${id}/members`,
  },

  // Attendance
  ATTENDANCE: {
    MARK: '/attendance',
    TODAY: '/attendance/today',
    HISTORY: '/attendance/history',
    STATS: (memberId: string) => `/attendance/stats/${memberId}`,
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
    INVITE_USER: '/tenant/users/invite',
    ACCEPT_INVITE: '/tenant/users/accept-invite',
    CREATE_USER: '/tenant/users',
    UPGRADE_PLAN: '/tenant/upgrade-plan',
  },

  // Billing
  BILLING: {
    CHECKOUT_SESSION: '/billing/checkout-session',
    PLANS: '/super-admin/get-all-plans',
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
