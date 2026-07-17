import type { Plan, PlanFeatures, PlanName, BillingInterval } from './models';

export interface CreatePlanRequest {
  name: PlanName;
  price: number;
  currency: string;
  interval: BillingInterval;
  stripePriceId?: string;
  features: PlanFeatures;
}

// types/plans.ts

export interface UpdatePlanRequest {
  name?: PlanName;
  price?: number;
  currency?: string;
  interval?: BillingInterval;
  stripePriceId?: string;
  features?: PlanFeatures;
}

export interface PlansResponse {
  success: boolean;
  data: Plan[];
}

export interface PlanResponse {
  success: boolean;
  data: Plan;
}

export interface DeletePlanResponse {
  success: boolean;
  message: string;
}

export interface FeatureEntry {
  key: string;
  value: string | number | boolean;
}
