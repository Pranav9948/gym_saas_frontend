// ===========================================
// Status Constants
// ===========================================

import type { MemberStatus, SubscriptionStatus } from '@/types';

// Member Status
export const MEMBER_STATUS: Record<string, MemberStatus> = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  BANNED: 'BANNED',
  DELETED: 'DELETED',
} as const;

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  BANNED: 'Banned',
  DELETED: 'Deleted',
} as const;

export const MEMBER_STATUS_COLORS: Record<MemberStatus, string> = {
  ACTIVE:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  INACTIVE:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PENDING:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  BANNED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  DELETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
} as const;

// Subscription Status
export const SUBSCRIPTION_STATUS: Record<string, SubscriptionStatus> = {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  INCOMPLETE: 'INCOMPLETE',
  TRIALING: 'TRIALING',
} as const;

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Active',
  PAST_DUE: 'Past Due',
  CANCELED: 'Canceled',
  INCOMPLETE: 'Incomplete',
  TRIALING: 'Trialing',
} as const;

export const SUBSCRIPTION_STATUS_COLORS: Record<SubscriptionStatus, string> = {
  ACTIVE:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  PAST_DUE:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  INCOMPLETE:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  TRIALING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
} as const;

// Generic active/inactive
export const ACTIVE_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
} as const;

export const ACTIVE_STATUS_LABELS: Record<string, string> = {
  true: 'Active',
  false: 'Inactive',
} as const;
