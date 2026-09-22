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
  },
} as const;

// Helper type for extracting query key types
export type QueryKeys = typeof queryKeys;
