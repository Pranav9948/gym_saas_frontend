// ===========================================
// Trainer Schemas - Zod validation schemas
// ===========================================

import { z } from 'zod';

// Create trainer schema
export const createTrainerSchema = z.object({
  userId: z.string().uuid('Please select a user'),
  specialization: z
    .string()
    .trim()
    .min(3, 'Specialization must be at least 3 characters'),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateTrainerFormData = z.infer<typeof createTrainerSchema>;

// Update trainer schema (all fields optional except userId)
export const updateTrainerSchema = z.object({
  specialization: z
    .string()
    .trim()
    .min(3, 'Specialization must be at least 3 characters')
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export type UpdateTrainerFormData = z.infer<typeof updateTrainerSchema>;

// Trainer ID param schema
export const trainerIdSchema = z.object({
  id: z.string().uuid('Invalid trainer ID'),
});

export type TrainerIdParams = z.infer<typeof trainerIdSchema>;
