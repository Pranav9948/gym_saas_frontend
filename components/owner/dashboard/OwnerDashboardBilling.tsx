'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpCircle,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { UsageMeter } from '@/components/owner/UsageMeter';
import { ManageBillingButton } from '@/components/owner/billing';
import { ROUTES } from '@/config';
import { useBillingSummary, useBillingUsage } from '@/hooks/billing';
import {
  formatBillingDate,
  formatCurrency,
  formatIntervalLabel,
  getHealthLabel,
  getStatusBadgeClass,
} from '@/lib/billing/format';

export function OwnerDashboardBillingHeaderActions() {
  const { data, isLoading } = useBillingSummary();
  const summary = data?.data;

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Skeleton className="h-7 w-28" />
      ) : (
        <Badge
          variant="outline"
          className={
            summary
              ? getStatusBadgeClass(summary.status)
              : 'border-success/30 bg-success/10 text-success'
          }
        >
          <span className="size-1.5 rounded-full bg-current" />
          {summary ? `${summary.plan.name} · ${summary.status}` : 'Loading…'}
        </Badge>
      )}
      <Button asChild>
        <Link href={ROUTES.OWNER_BILLING}>
          <ArrowUpCircle className="size-4" />
          Upgrade
        </Link>
      </Button>
    </div>
  );
}

export function OwnerDashboardCapacityAlert() {
  const { data } = useBillingUsage();
  const members = data?.data.members;

  if (!members || members.isUnlimited || !members.limit) {
    return null;
  }

  if (members.percentageUsed < 70) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
        <p className="text-sm text-foreground">
          You are near your member limit ({members.used}/{members.limit}). Upgrade to
          add more members.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 border-warning/40 bg-transparent text-foreground hover:bg-warning/15"
        asChild
      >
        <Link href={ROUTES.OWNER_BILLING}>Upgrade Plan</Link>
      </Button>
    </div>
  );
}

export function OwnerDashboardBillingKpis() {
  const { data: summaryResponse, isLoading: summaryLoading } = useBillingSummary();
  const { data: usageResponse, isLoading: usageLoading } = useBillingUsage();
  const summary = summaryResponse?.data;
  const usage = usageResponse?.data;
  const isLoading = summaryLoading || usageLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!summary || !usage) {
    return null;
  }

  const capacityPct = usage.members.isUnlimited
    ? 0
    : usage.members.percentageUsed;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="gap-0 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
          <div className="flex size-9 items-center justify-center rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="size-4.5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-success" />
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {summary.status}
          </p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {getHealthLabel(summary.health)}
        </p>
      </Card>

      <Card className="gap-0 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Plan &amp; Cost</p>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="size-4.5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {summary.plan.name} Plan
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatCurrency(summary.plan.price, summary.plan.currency)}/
          {formatIntervalLabel(summary.billingInterval)}
        </p>
      </Card>

      <Card className="gap-0 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Renewal Date</p>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarClock className="size-4.5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {summary.nextRenewal ? formatBillingDate(summary.nextRenewal) : '—'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {summary.isPaid
            ? `Renews in ${summary.daysRemaining} days`
            : 'No renewal scheduled'}
        </p>
      </Card>

      <Card className="gap-0 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Member Capacity</p>
          <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <UsersRound className="size-4.5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {usage.members.isUnlimited
            ? `${usage.members.used} / Unlimited`
            : `${usage.members.used} / ${usage.members.limit}`}
        </p>
        {!usage.members.isUnlimited ? (
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-warning transition-all"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export function OwnerDashboardTrainerSlotsCard() {
  const { data, isLoading } = useBillingUsage();
  const trainers = data?.data.trainers;

  if (isLoading) {
    return (
      <Card className="gap-0 p-5">
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  if (!trainers) {
    return null;
  }

  const pct = trainers.isUnlimited
    ? 0
    : trainers.limit
      ? Math.round((trainers.used / trainers.limit) * 100)
      : 0;

  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Trainer Slots</p>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-4.5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        {trainers.isUnlimited
          ? `${trainers.used} / Unlimited`
          : `${trainers.used} / ${trainers.limit}`}
      </p>
      {!trainers.isUnlimited && trainers.limit ? (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </Card>
  );
}

export function OwnerDashboardPlanSummaryCard() {
  const { data: summaryResponse, isLoading: summaryLoading } = useBillingSummary();
  const { data: usageResponse, isLoading: usageLoading } = useBillingUsage();
  const summary = summaryResponse?.data;
  const usage = usageResponse?.data;

  if (summaryLoading || usageLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Financial &amp; Plan Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!summary || !usage) {
    return null;
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Financial &amp; Plan Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {summary.plan.name} Plan · {summary.billingInterval} ·{' '}
            {formatCurrency(summary.plan.price, summary.plan.currency)}/
            {formatIntervalLabel(summary.billingInterval)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{summary.plan.description}</p>
        </div>

        <div className="space-y-3">
          <UsageMeter
            label="Members"
            current={usage.members.used}
            max={usage.members.isUnlimited ? null : usage.members.limit}
            isUnlimited={usage.members.isUnlimited}
          />
          <UsageMeter
            label="Trainers"
            current={usage.trainers.used}
            max={usage.trainers.isUnlimited ? null : usage.trainers.limit}
            isUnlimited={usage.trainers.isUnlimited}
          />
          <UsageMeter
            label="Staff"
            current={usage.staff.used}
            max={usage.staff.isUnlimited ? null : usage.staff.limit}
            isUnlimited={usage.staff.isUnlimited}
          />
        </div>

        <ManageBillingButton className="w-full" />

        <Separator />

        <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 opacity-70">
          <p className="text-sm font-medium text-muted-foreground">Member Revenue</p>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
