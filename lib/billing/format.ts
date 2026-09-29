import type { BillingSubscriptionHealth } from '@/types/billing';
import type { BillingInterval, SubscriptionStatus } from '@/types/models';

import { formatInr } from '@/lib/money';

export function formatCurrency(amount: number, currency?: string | null): string {
  return formatInr(amount, currency);
}

export function formatBillingDate(iso: string | null | undefined): string {
  if (!iso) return '—';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function formatIntervalLabel(interval: BillingInterval): string {
  return interval === 'MONTHLY' ? 'month' : 'year';
}

export function formatIntervalShort(interval: BillingInterval): string {
  return interval === 'MONTHLY' ? 'mo' : 'yr';
}

export function toggleToBillingInterval(
  toggle: 'monthly' | 'yearly',
): BillingInterval {
  return toggle === 'monthly' ? 'MONTHLY' : 'YEARLY';
}

export function getHealthLabel(health: BillingSubscriptionHealth): string {
  const labels: Record<BillingSubscriptionHealth, string> = {
    HEALTHY: 'Healthy',
    TRIAL: 'Trial',
    PAYMENT_REQUIRED: 'Payment required',
    CANCELED: 'Canceled',
    ACTION_REQUIRED: 'Action required',
  };

  return labels[health];
}

export function getHealthBadgeClass(health: BillingSubscriptionHealth): string {
  switch (health) {
    case 'HEALTHY':
    case 'TRIAL':
      return 'border-success/30 bg-success/10 text-success';
    case 'PAYMENT_REQUIRED':
    case 'ACTION_REQUIRED':
      return 'border-warning/30 bg-warning/10 text-warning';
    case 'CANCELED':
      return 'border-destructive/30 bg-destructive/10 text-destructive';
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

export function getStatusBadgeClass(status: SubscriptionStatus): string {
  switch (status) {
    case 'ACTIVE':
    case 'TRIALING':
      return 'border-success/30 bg-success/10 text-success';
    case 'PAST_DUE':
    case 'INCOMPLETE':
      return 'border-warning/30 bg-warning/10 text-warning';
    case 'CANCELED':
      return 'border-destructive/30 bg-destructive/10 text-destructive';
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

export function featureLabelToDisplay(feature: string): string {
  switch (feature) {
    case 'MEMBERS':
      return 'members';
    case 'TRAINERS':
      return 'trainers';
    case 'STAFF':
      return 'staff';
    default:
      return feature.toLowerCase();
  }
}

export function formatPlanFeatureLabel(feature: {
  key: string;
  value: string | number | boolean;
}): string {
  if (typeof feature.value === 'boolean') {
    return feature.key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  }

  if (feature.key === 'maxMembers') {
    return `Up to ${feature.value} members`;
  }

  if (feature.key === 'maxTrainers') {
    return `Up to ${feature.value} trainers`;
  }

  if (feature.key === 'maxStaff') {
    return `Up to ${feature.value} staff`;
  }

  const label = feature.key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase());

  return `${label}: ${String(feature.value)}`;
}
