// ===========================================
// Billing Service - Owner billing API calls
// ===========================================

import { get, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import { billingTrace } from '@/lib/billing/trace';
import type {
  BillingPaymentHistoryResponse,
  BillingPlansResponse,
  BillingSubscriptionResponse,
  BillingSummaryResponse,
  BillingUsageResponse,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  CustomerPortalResponse,
  PaymentHistoryParams,
} from '@/types/billing';

export const billingService = {
  getSummary: async (): Promise<BillingSummaryResponse> => {
    const api = API_ENDPOINTS.BILLING.SUMMARY;
    try {
      const out = await get<BillingSummaryResponse>(api);
      billingTrace('GET /billing/summary', {
        api,
        method: 'GET',
        out: out.data,
      });
      return out;
    } catch (error) {
      billingTrace('GET /billing/summary', { api, method: 'GET', error });
      throw error;
    }
  },

  getSubscription: async (): Promise<BillingSubscriptionResponse> => {
    const api = API_ENDPOINTS.BILLING.SUBSCRIPTION;
    try {
      const out = await get<BillingSubscriptionResponse>(api);
      billingTrace('GET /billing/subscription', {
        api,
        method: 'GET',
        out: out.data,
      });
      return out;
    } catch (error) {
      billingTrace('GET /billing/subscription', { api, method: 'GET', error });
      throw error;
    }
  },

  getPlans: async (): Promise<BillingPlansResponse> => {
    const api = API_ENDPOINTS.BILLING.PLANS;
    try {
      const out = await get<BillingPlansResponse>(api);
      billingTrace('GET /billing/plans', {
        api,
        method: 'GET',
        out: { planCount: out.data?.plans?.length, plans: out.data?.plans?.map((p) => ({ id: p.id, name: p.name, current: p.current })) },
      });
      return out;
    } catch (error) {
      billingTrace('GET /billing/plans', { api, method: 'GET', error });
      throw error;
    }
  },

  getUsage: async (): Promise<BillingUsageResponse> => {
    const api = API_ENDPOINTS.BILLING.USAGE;
    try {
      const out = await get<BillingUsageResponse>(api);
      billingTrace('GET /billing/usage', {
        api,
        method: 'GET',
        out: out.data,
      });
      return out;
    } catch (error) {
      billingTrace('GET /billing/usage', { api, method: 'GET', error });
      throw error;
    }
  },

  getPaymentHistory: async (
    params: PaymentHistoryParams = {},
  ): Promise<BillingPaymentHistoryResponse> => {
    const api = API_ENDPOINTS.BILLING.PAYMENT_HISTORY;
    try {
      const out = await get<BillingPaymentHistoryResponse>(
        api,
        params as Record<string, unknown>,
      );
      billingTrace('GET /billing/payment-history', {
        api,
        method: 'GET',
        in: params,
        out: {
          count: out.data?.payments?.length,
          pagination: out.data?.pagination,
        },
      });
      return out;
    } catch (error) {
      billingTrace('GET /billing/payment-history', {
        api,
        method: 'GET',
        in: params,
        error,
      });
      throw error;
    }
  },

  createCheckoutSession: async (
    data: CheckoutSessionRequest,
  ): Promise<CheckoutSessionResponse> => {
    const api = API_ENDPOINTS.BILLING.CHECKOUT_SESSION;
    billingTrace('POST /billing/checkout-session (start)', {
      api,
      method: 'POST',
      in: data,
    });
    try {
      const out = await post<CheckoutSessionResponse>(api, data);
      billingTrace('POST /billing/checkout-session (success)', {
        api,
        method: 'POST',
        in: data,
        out: {
          success: out.success,
          urlHost: out.data?.url ? new URL(out.data.url).host : null,
        },
      });
      return out;
    } catch (error) {
      billingTrace('POST /billing/checkout-session (failed)', {
        api,
        method: 'POST',
        in: data,
        error,
      });
      throw error;
    }
  },

  createCustomerPortalSession: async (): Promise<CustomerPortalResponse> => {
    const api = API_ENDPOINTS.BILLING.CUSTOMER_PORTAL;
    try {
      const out = await post<CustomerPortalResponse>(api);
      billingTrace('POST /billing/customer-portal', {
        api,
        method: 'POST',
        out: { success: out.success, urlHost: out.data?.url ? new URL(out.data.url).host : null },
      });
      return out;
    } catch (error) {
      billingTrace('POST /billing/customer-portal', { api, method: 'POST', error });
      throw error;
    }
  },

  redirectToCheckout: async (payload: CheckoutSessionRequest): Promise<void> => {
    const response = await billingService.createCheckoutSession(payload);

    if (response.success && response.data?.url) {
      window.location.href = response.data.url;
      return;
    }

    throw new Error('Failed to create checkout session');
  },

  redirectToCustomerPortal: async (): Promise<void> => {
    const response = await billingService.createCustomerPortalSession();

    if (response.success && response.data?.url) {
      window.location.href = response.data.url;
      return;
    }

    throw new Error('Failed to open billing portal');
  },

  syncCheckoutSession: async (
    sessionId: string,
  ): Promise<BillingSummaryResponse> => {
    const api = API_ENDPOINTS.BILLING.SYNC_CHECKOUT_SESSION;
    billingTrace('POST /billing/sync-checkout-session (start)', {
      api,
      method: 'POST',
      in: { sessionId },
    });
    try {
      const out = await post<BillingSummaryResponse>(api, { sessionId });
      billingTrace('POST /billing/sync-checkout-session (success)', {
        api,
        method: 'POST',
        in: { sessionId },
        out: out.data,
      });
      return out;
    } catch (error) {
      billingTrace('POST /billing/sync-checkout-session (failed)', {
        api,
        method: 'POST',
        in: { sessionId },
        error,
      });
      throw error;
    }
  },

  reconcileSubscription: async (): Promise<BillingSummaryResponse> => {
    const api = API_ENDPOINTS.BILLING.RECONCILE_SUBSCRIPTION;
    try {
      const out = await post<BillingSummaryResponse>(api);
      billingTrace('POST /billing/reconcile-subscription', {
        api,
        method: 'POST',
        out: out.data,
      });
      return out;
    } catch (error) {
      billingTrace('POST /billing/reconcile-subscription', {
        api,
        method: 'POST',
        error,
      });
      throw error;
    }
  },
};
