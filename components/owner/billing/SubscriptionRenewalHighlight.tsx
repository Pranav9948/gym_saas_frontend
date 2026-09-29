'use client';

import { CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatBillingDate } from '@/lib/billing/format';
import { cn } from '@/lib/utils';

interface SubscriptionRenewalHighlightProps {
  nextRenewal: string | null;
  daysRemaining: number;
  isPaid: boolean;
  cancelAtPeriodEnd?: boolean;
}

function daysLabel(days: number): string {
  if (days <= 0) return 'Subscription ended';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

function toneClass(days: number, isPaid: boolean): string {
  if (!isPaid) {
    return 'border-border bg-muted/50';
  }
  if (days <= 0) {
    return 'border-destructive/40 bg-destructive/10';
  }
  if (days <= 7) {
    return 'border-warning/40 bg-warning/10';
  }
  return 'border-primary/35 bg-primary/10';
}

function daysBadgeClass(days: number): string {
  if (days <= 0) {
    return 'border-destructive/40 bg-destructive text-destructive-foreground';
  }
  if (days <= 7) {
    return 'border-warning/40 bg-warning text-warning-foreground';
  }
  return 'border-primary/40 bg-primary text-primary-foreground';
}

export function SubscriptionRenewalHighlight({
  nextRenewal,
  daysRemaining,
  isPaid,
  cancelAtPeriodEnd = false,
}: SubscriptionRenewalHighlightProps) {
  if (!isPaid) {
    return (
      <div className={cn('rounded-xl border px-4 py-3', toneClass(0, false))}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Next renewal
        </p>
        <p className="mt-1 text-sm text-muted-foreground">No renewal scheduled on the Free plan.</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border px-4 py-3', toneClass(daysRemaining, true))}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background/80">
            <CalendarClock className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Next renewal
            </p>
            <p className="mt-0.5 text-lg font-bold tracking-tight text-foreground">
              {nextRenewal ? formatBillingDate(nextRenewal) : 'Date unavailable'}
            </p>
            {cancelAtPeriodEnd ? (
              <p className="mt-1 text-xs font-medium text-warning">
                Cancels at the end of this period
              </p>
            ) : null}
          </div>
        </div>

        <Badge
          className={cn(
            'h-auto justify-center px-3 py-2 text-sm font-semibold',
            daysBadgeClass(daysRemaining),
          )}
        >
          {daysLabel(daysRemaining)}
        </Badge>
      </div>
    </div>
  );
}
