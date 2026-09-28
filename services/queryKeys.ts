// ===========================================
// Query Keys - TanStack Query key factory
// ===========================================

import type { PaymentHistoryParams } from '@/types/billing';

// Query key factory for consistent cache management
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    resetCodes: () => [...queryKeys.auth.all, 'reset-codes'] as const,
  },

  // Tenant
  tenant: {
    all: ['tenant'] as const,
    current: () => [...queryKeys.tenant.all, 'current'] as const,
    team: () => [...queryKeys.tenant.all, 'team'] as const,
    invites: () => [...queryKeys.tenant.all, 'invites'] as const,
  },

  // Members
  members: {
    all: ['members'] as const,
    lists: () => [...queryKeys.members.all, 'list'] as const,
    list: (params?: {
      page?: number;
      limit?: number;
      packageId?: string;
      paymentStatus?: string;
      expirationWindow?: string;
      search?: string;
    }) => [...queryKeys.members.lists(), params] as const,
    details: () => [...queryKeys.members.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.members.details(), id] as const,
    attendance: (id: string) =>
      [...queryKeys.members.detail(id), 'attendance'] as const,
    goals: (id: string) => [...queryKeys.members.detail(id), 'goals'] as const,
  },

  // Trainers
  trainers: {
    all: ['trainers'] as const,
    lists: () => [...queryKeys.trainers.all, 'list'] as const,
    list: (params?: { page?: number; limit?: number }) =>
      [...queryKeys.trainers.lists(), params] as const,
    details: () => [...queryKeys.trainers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.trainers.details(), id] as const,
    members: (id: string, params?: { page?: number; limit?: number }) =>
      [...queryKeys.trainers.detail(id), 'members', params] as const,
    overview: () => [...queryKeys.trainers.all, 'overview'] as const,
    performance: (
      id: string,
      params?: { range?: string; from?: string; to?: string },
    ) => [...queryKeys.trainers.detail(id), 'performance', params] as const,
    me: () => [...queryKeys.trainers.all, 'me'] as const,
    myMembers: (params?: { page?: number; limit?: number; date?: string }) =>
      [...queryKeys.trainers.all, 'me-members', params] as const,
  },

  portal: {
    all: ['portal'] as const,
    me: () => [...queryKeys.portal.all, 'me'] as const,
    training: (date?: string) =>
      [...queryKeys.portal.all, 'training', date] as const,
    history: () => [...queryKeys.portal.all, 'history'] as const,
    workoutLogs: (filters?: {
      muscleGroup?: string
      exercise?: string
      date?: string
    }) => [...queryKeys.portal.all, 'workout-logs', filters] as const,
    workoutCatalog: () => [...queryKeys.portal.all, 'workout-catalog'] as const,
    workoutPerformance: (muscleGroup?: string, exercise?: string) =>
      [...queryKeys.portal.all, 'workout-performance', muscleGroup, exercise] as const,
  },

  workoutLogs: {
    all: ['workout-logs'] as const,
    byMember: (
      memberId: string,
      filters?: { muscleGroup?: string; exercise?: string; date?: string },
    ) => [...queryKeys.workoutLogs.all, memberId, filters] as const,
    catalog: (memberId: string) =>
      [...queryKeys.workoutLogs.all, memberId, 'catalog'] as const,
    performance: (memberId: string, muscleGroup?: string, exercise?: string) =>
      [...queryKeys.workoutLogs.all, memberId, 'performance', muscleGroup, exercise] as const,
  },

  workouts: {
    all: ['workouts'] as const,
    byMember: (memberId: string, date?: string) =>
      [...queryKeys.workouts.all, memberId, date] as const,
    lastPerformance: (memberId: string, before?: string) =>
      [...queryKeys.workouts.all, memberId, 'last-performance', before] as const,
  },

  diets: {
    all: ['diets'] as const,
    byMember: (memberId: string, date?: string) =>
      [...queryKeys.diets.all, memberId, date] as const,
  },

  packages: {
    all: ['packages'] as const,
    list: (includeInactive?: boolean) =>
      [...queryKeys.packages.all, 'list', includeInactive] as const,
  },

  staffAttendance: {
    all: ['staff-attendance'] as const,
    metrics: (params?: { range?: string; from?: string; to?: string }) =>
      [...queryKeys.staffAttendance.all, 'metrics', params] as const,
    byDate: (date: string) =>
      [...queryKeys.staffAttendance.all, 'date', date] as const,
  },

  // Attendance
  attendance: {
    all: ['attendance'] as const,
    today: () => [...queryKeys.attendance.all, 'today'] as const,
    history: (date: string) =>
      [...queryKeys.attendance.all, 'history', date] as const,
    stats: (memberId: string) =>
      [...queryKeys.attendance.all, 'stats', memberId] as const,
  },

  // Goals
  goals: {
    all: ['goals'] as const,
    byMember: (memberId: string) =>
      [...queryKeys.goals.all, 'member', memberId] as const,
  },

  // Billing
  billing: {
    all: ['billing'] as const,
    plans: () => [...queryKeys.billing.all, 'plans'] as const,
    summary: () => [...queryKeys.billing.all, 'summary'] as const,
    subscription: () => [...queryKeys.billing.all, 'subscription'] as const,
    usage: () => [...queryKeys.billing.all, 'usage'] as const,
    paymentHistory: (params?: PaymentHistoryParams) =>
      [...queryKeys.billing.all, 'payment-history', params ?? {}] as const,
  },

  // RBAC
  rbac: {
    all: ['rbac'] as const,
    permissions: () => [...queryKeys.rbac.all, 'permissions'] as const,
    roles: (tenantId: string) => [...queryKeys.rbac.all, 'roles', tenantId] as const,
  },

  // Analytics (future)
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    members: () => [...queryKeys.analytics.all, 'members'] as const,
    revenue: () => [...queryKeys.analytics.all, 'revenue'] as const,
  },

  // Super Admin
  superAdmin: {
    all: ['super-admin'] as const,
    plans: {
      all: () => [...queryKeys.superAdmin.all, 'plans'] as const,
      lists: () => [...queryKeys.superAdmin.plans.all(), 'list'] as const,
      list: () => [...queryKeys.superAdmin.plans.lists()] as const,
      details: () => [...queryKeys.superAdmin.plans.all(), 'detail'] as const,
      detail: (id: string) =>
        [...queryKeys.superAdmin.plans.details(), id] as const,
    },
    gyms: {
      all: () => [...queryKeys.superAdmin.all, 'gyms'] as const,
      list: (filters?: {
        page?: number
        limit?: number
        q?: string
        status?: string
      }) => [...queryKeys.superAdmin.gyms.all(), 'list', filters] as const,
    },
    owners: {
      all: () => [...queryKeys.superAdmin.all, 'owners'] as const,
      list: (filters?: {
        page?: number
        limit?: number
        q?: string
        status?: string
      }) => [...queryKeys.superAdmin.owners.all(), 'list', filters] as const,
      detail: (id: string) =>
        [...queryKeys.superAdmin.owners.all(), 'detail', id] as const,
    },
    me: () => [...queryKeys.superAdmin.all, 'me'] as const,
    billing: () => [...queryKeys.superAdmin.all, 'billing'] as const,
    analytics: () => [...queryKeys.superAdmin.all, 'analytics'] as const,
    dashboard: () => [...queryKeys.superAdmin.all, 'dashboard'] as const,
    resetCodes: () => [...queryKeys.superAdmin.all, 'reset-codes'] as const,
    notifications: () => [...queryKeys.superAdmin.all, 'notifications'] as const,
  },
} as const;

// Helper type for extracting query key types
export type QueryKeys = typeof queryKeys;
