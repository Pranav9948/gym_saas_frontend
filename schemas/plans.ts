/**
 * Plan Validation Schemas
 */

import { z } from 'zod';

export const PlanNameEnum = z.enum(['FREE', 'BASIC', 'PRO']);
export const BillingIntervalEnum = z.enum(['MONTHLY', 'YEARLY']);

export const CreatePlanSchema = z.object({
  name: PlanNameEnum,
  price: z.number().min(0, 'Price must be 0 or greater'),
  currency: z.string().min(1, 'Currency is required'),
  interval: BillingIntervalEnum,
  stripePriceId: z.string().optional().or(z.literal('')),
  features: z
    .object({
      maxMembers: z.number().int().min(-1),
      maxTrainers: z.number().int().min(-1),
      prioritySupport: z.boolean(),
    })
    .catchall(z.union([z.string(), z.number(), z.boolean()])),
});

export const UpdatePlanSchema = CreatePlanSchema.partial();

export const DeletePlanSchema = z.object({
  id: z.string().min(1, 'Plan ID is required'),
});

export type CreatePlanFormData = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanFormData = z.infer<typeof UpdatePlanSchema>;
export type DeletePlanFormData = z.infer<typeof DeletePlanSchema>;
