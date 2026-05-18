// ===========================================
// Billing Schemas - Zod validation schemas
// ===========================================

import { z } from 'zod';

// Checkout session schema (actual backend expects planId)
export const checkoutSessionSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
});

export type CheckoutSessionFormData = z.infer<typeof checkoutSessionSchema>;

// Alternative schema matching backend CreateCheckoutSessionSchema
// (not actually wired in backend, but defined there)
export const alternativeCheckoutSchema = z.object({
  plan: z.enum(['BASIC', 'PRO']),
  interval: z.enum(['MONTHLY', 'YEARLY']),
});

export type AlternativeCheckoutFormData = z.infer<
  typeof alternativeCheckoutSchema
>;
