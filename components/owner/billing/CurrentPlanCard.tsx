'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBillingSummary } from '@/hooks/billing';
import {
  formatBillingDate,
  formatCurrency,
  formatIntervalLabel,
  getHealthBadgeClass,
  getHealthLabel,
  getStatusBadgeClass,
} from '@/lib/billing/format';
import { BillingSectionError } from './BillingSectionError';
import { ManageBillingButton } from './ManageBillingButton';

export function CurrentPlanCard() {
  const { data, isLoading, isError, refetch } = useBillingSummary();
  const summary = data?.data;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-16 w-full max-w-sm" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !summary) {
    return (
      <BillingSectionError
        message="Unable to load your current subscription."
        onRetry={() => refetch()}
      />
    );
  }

  const isActive = summary.status === 'ACTIVE' || summary.status === 'TRIALING';
  const renewalText = summary.nextRenewal
    ? `Renews on ${formatBillingDate(summary.nextRenewal)} · in ${summary.daysRemaining} days`
    : summary.isPaid
      ? 'Renewal date unavailable'
      : 'No renewal scheduled';

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Current plan
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {summary.plan.name} Plan
            </h2>
            <Badge
              variant="outline"
              className={
                isActive
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-muted-foreground/30 bg-muted text-muted-foreground'
              }
            >
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline" className={getStatusBadgeClass(summary.status)}>
              {summary.status}
            </Badge>
            <Badge variant="outline" className={getHealthBadgeClass(summary.health)}>
              {getHealthLabel(summary.health)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{renewalText}</p>

          {summary.cancelAtPeriodEnd ? (
            <p className="text-sm font-medium text-warning">
              Your subscription will cancel at the end of the current billing period.
            </p>
          ) : null}

          <p className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {formatCurrency(summary.plan.price, summary.plan.currency)}
            <span className="text-base font-normal text-muted-foreground">
              /{formatIntervalLabel(summary.billingInterval)}
            </span>
          </p>
        </div>

        {summary.isPaid ? (
          <ManageBillingButton variant="outline" />
        ) : null}
      </CardContent>
    </Card>
  );
}
