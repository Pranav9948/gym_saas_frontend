'use client';

import React from 'react';
import { Check, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useBillingPlans } from '@/hooks/billing';
import { useCheckoutSession } from '@/hooks/billing';
import {
  formatCurrency,
  formatIntervalShort,
  formatPlanFeatureLabel,
  toggleToBillingInterval,
} from '@/lib/billing/format';
import {
  canUpgradeToPlan,
  filterPlansByInterval,
  isRecommendedPlan,
} from '@/lib/billing/plans';
import { resetBillingTrace, billingTrace } from '@/lib/billing/trace';
import { BillingSectionError } from './BillingSectionError';

export function PlanComparisonGrid() {
  const [interval, setInterval] = React.useState<'monthly' | 'yearly'>('monthly');
  const { data, isLoading, isError, refetch } = useBillingPlans();
  const checkout = useCheckoutSession();
  const [upgradingPlanId, setUpgradingPlanId] = React.useState<string | null>(null);

  const plans = filterPlansByInterval(
    data?.data.plans ?? [],
    toggleToBillingInterval(interval),
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <BillingSectionError
        message="Unable to load available plans."
        onRetry={() => refetch()}
      />
    );
  }

  if (plans.length === 0) {
    return (
      <BillingSectionError message="No plans are available for the selected billing interval." />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Compare plans</h2>
          <p className="text-sm text-muted-foreground">Upgrade or downgrade at any time.</p>
        </div>

        <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-1">
          {(['monthly', 'yearly'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setInterval(option)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                interval === option
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.current;
          const recommended = isRecommendedPlan(plan);
          const upgradable = canUpgradeToPlan(plan);
          const isLoadingCheckout = checkout.isPending && upgradingPlanId === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col',
                isCurrent && 'border-primary ring-1 ring-primary',
                recommended && !isCurrent && 'border-primary/60',
              )}
            >
              {isCurrent ? (
                <Badge className="absolute right-4 top-4">Current</Badge>
              ) : recommended ? (
                <Badge className="absolute right-4 top-4 gap-1">
                  <Sparkles className="size-3" />
                  Recommended
                </Badge>
              ) : null}

              <CardHeader>
                <CardTitle className="text-base uppercase tracking-wide">
                  {plan.name}
                </CardTitle>
                <p className="pt-2 font-mono text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(plan.price, plan.currency)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{formatIntervalShort(plan.interval)}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="flex-1 space-y-2">
                  {plan.features.length > 0 ? (
                    plan.features.map((feature) => (
                      <li
                        key={`${plan.id}-${feature.key}`}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <Check className="size-4 shrink-0 text-success" />
                        {formatPlanFeatureLabel(feature)}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      Core gym management features included.
                    </li>
                  )}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  disabled={isCurrent || !upgradable || checkout.isPending}
                  onClick={() => {
                    if (!upgradable) return;
                    resetBillingTrace('checkout');
                    billingTrace('User clicked Upgrade', {
                      note: `planId=${plan.id}, planName=${plan.name}`,
                    });
                    setUpgradingPlanId(plan.id);
                    checkout.mutate(plan.id, {
                      onSettled: () => setUpgradingPlanId(null),
                    });
                  }}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      Current Plan
                    </>
                  ) : isLoadingCheckout ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Redirecting…
                    </>
                  ) : plan.name === 'FREE' ? (
                    'Included'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
