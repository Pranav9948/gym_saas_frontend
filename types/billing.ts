// ===========================================
// Billing DTOs — aligned with backend APIs
// ===========================================

import type { BillingInterval, PlanName, SubscriptionStatus } from './models';

export type BillingSubscriptionHealth =
  | 'HEALTHY'
  | 'TRIAL'
  | 'PAYMENT_REQUIRED'
  | 'CANCELED'
  | 'ACTION_REQUIRED';

export type BillingPaymentStatus =
  | 'PAID'
  | 'OPEN'
  | 'DRAFT'
  | 'VOID'
  | 'UNCOLLECTIBLE';

export interface BillingPlanFeature {
  key: string;
  value: string | number | boolean;
}

export interface BillingPlan {
  id: string;
  name: PlanName;
  description: string;
  price: number;
  currency: string;
  interval: BillingInterval;
  stripePriceId: string | null;
  features: BillingPlanFeature[];
  current: boolean;
}

export interface BillingSubscriptionPlan {
  name: PlanName;
  description: string;
  price: number;
  currency: string;
}

export interface BillingSummary {
  plan: BillingSubscriptionPlan;
  status: SubscriptionStatus;
  health: BillingSubscriptionHealth;
  billingInterval: BillingInterval;
  isPaid: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  nextRenewal: string | null;
  daysRemaining: number;
  cancelAtPeriodEnd: boolean;
}

export interface BillingSubscription {
  plan: BillingSubscriptionPlan;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isPaid: boolean;
}

export interface FeatureUsageStat {
  used: number;
  limit: number | null;
  remaining: number | null;
  percentageUsed: number;
  isUnlimited: boolean;
  isLimitReached: boolean;
}

export interface BillingUsage {
  plan: PlanName;
  members: FeatureUsageStat;
  trainers: FeatureUsageStat;
  staff: FeatureUsageStat;
}

export interface BillingPaymentHistoryItem {
  invoiceNumber: string | null;
  status: BillingPaymentStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
}

export interface BillingPaymentHistoryPagination {
  hasMore: boolean;
  nextStartingAfter: string | null;
}

export interface BillingPaymentHistory {
  payments: BillingPaymentHistoryItem[];
  pagination: BillingPaymentHistoryPagination;
}

export interface BillingPlansData {
  plans: BillingPlan[];
}

export interface CheckoutSessionData {
  url: string;
}

export interface CustomerPortalData {
  url: string;
}

export interface BillingSummaryResponse {
  success: true;
  data: BillingSummary;
}

export interface BillingSubscriptionResponse {
  success: true;
  data: BillingSubscription;
}

export interface BillingUsageResponse {
  success: true;
  data: BillingUsage;
}

export interface BillingPlansResponse {
  success: true;
  data: BillingPlansData;
}

export interface BillingPaymentHistoryResponse {
  success: true;
  data: BillingPaymentHistory;
}

export interface CheckoutSessionResponse {
  success: true;
  data: CheckoutSessionData;
}

export interface CustomerPortalResponse {
  success: true;
  data: CustomerPortalData;
}

export interface CheckoutSessionRequest {
  planId?: string;
  priceId?: string;
}

export interface SyncCheckoutSessionRequest {
  sessionId: string;
}

export interface PaymentHistoryParams {
  limit?: number;
  starting_after?: string;
}

export type BillingIntervalToggle = 'monthly' | 'yearly';

export interface FeatureLimitErrorPayload {
  code: 'FEATURE_LIMIT_REACHED';
  message: string;
  feature: string;
  currentPlan: PlanName;
  limit: number;
  used: number;
}
