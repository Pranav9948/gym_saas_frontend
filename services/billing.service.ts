// ===========================================
// Billing Service - Billing/Subscription API calls
// ===========================================

import { get, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  PlansResponse,
} from '@/types';

export const billingService = {
  /**
   * Create a Stripe checkout session
   * Note: No permission middleware - any authenticated user can create
   */
  createCheckoutSession: async (
    data: CheckoutSessionRequest,
  ): Promise<CheckoutSessionResponse> => {
    return post<CheckoutSessionResponse>(
      API_ENDPOINTS.BILLING.CHECKOUT_SESSION,
      data,
    );
  },

  /**
   * Get all available plans
   * Note: This is a public endpoint (no auth required)
   */
  getPlans: async (): Promise<PlansResponse> => {
    return get<PlansResponse>(API_ENDPOINTS.BILLING.PLANS);
  },

  /**
   * Redirect to Stripe checkout
   * Helper function that creates session and redirects
   */
  redirectToCheckout: async (planId: string): Promise<void> => {
    const response = await billingService.createCheckoutSession({ planId });

    if (response.success && response.data?.url) {
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } else {
      throw new Error('Failed to create checkout session');
    }
  },
};
