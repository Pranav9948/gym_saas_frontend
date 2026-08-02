import type { BillingPlan } from '@/types/billing';
import type { BillingInterval, PlanName } from '@/types/models';

const TIER_ORDER: PlanName[] = ['FREE', 'BASIC', 'PRO'];

export function filterPlansByInterval(
  plans: BillingPlan[],
  interval: BillingInterval,
): BillingPlan[] {
  return plans
    .filter((plan) => plan.interval === interval)
    .sort(
      (a, b) => TIER_ORDER.indexOf(a.name) - TIER_ORDER.indexOf(b.name),
    );
}

export function isRecommendedPlan(plan: BillingPlan): boolean {
  return plan.name === 'PRO' && !plan.current;
}

export function canUpgradeToPlan(plan: BillingPlan): boolean {
  return !plan.current && plan.name !== 'FREE';
}
