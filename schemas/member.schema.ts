// ===========================================
// Member Schemas - Zod validation schemas
// ===========================================

import { z } from 'zod';

// E.164 phone format regex
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Create member schema
export const createMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number (E.164 format)')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.coerce.date().optional().nullable(),
  assignedTrainerId: z
    .string()
    .uuid('Invalid trainer ID')
    .optional()
    .nullable(),
});

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;

// Update member schema (all fields optional)
export const updateMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional(),
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number (E.164 format)')
    .optional()
    .nullable()
    .or(z.literal('')),
  dateOfBirth: z.coerce.date().optional().nullable(),
  assignedTrainerId: z
    .string()
    .uuid('Invalid trainer ID')
    .optional()
    .nullable(),
});

export type UpdateMemberFormData = z.infer<typeof updateMemberSchema>;

// Member ID param schema
export const memberIdSchema = z.object({
  id: z.string().uuid('Invalid member ID'),
});

export type MemberIdParams = z.infer<typeof memberIdSchema>;
