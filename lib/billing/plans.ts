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

export function planTier(name: PlanName | null | undefined): number {
  if (!name) return 0;
  const index = TIER_ORDER.indexOf(name);
  return index === -1 ? 0 : index;
}

export function currentPlanName(plans: BillingPlan[]): PlanName {
  return plans.find((plan) => plan.current)?.name ?? 'FREE';
}

export function isRecommendedPlan(plan: BillingPlan, currentName: PlanName): boolean {
  return plan.name === 'PRO' && currentName !== 'PRO';
}

export function isPlanDowngrade(plan: BillingPlan, currentName: PlanName): boolean {
  return planTier(plan.name) < planTier(currentName);
}

export function canUpgradeToPlan(plan: BillingPlan, currentName: PlanName): boolean {
  if (plan.current || plan.name === 'FREE') {
    return false;
  }

  return planTier(plan.name) > planTier(currentName);
}
