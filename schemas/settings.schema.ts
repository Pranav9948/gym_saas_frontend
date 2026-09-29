// ===========================================
// Settings Schemas - Zod validation schemas
// ===========================================

import { z } from 'zod';
import { passwordSchema } from './auth.schema';

// Update tenant schema
export const updateTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Gym name must be at least 2 characters')
    .max(100, 'Gym name must be at most 100 characters')
    .optional(),
  contactPhone: z
    .string()
    .min(8, 'Phone number must be at least 8 characters')
    .max(20, 'Phone number must be at most 20 characters')
    .regex(/^[0-9+\-() ]+$/, 'Phone number contains invalid characters')
    .optional(),
  contactEmail: z
    .string()
    .email('Please enter a valid contact email')
    .optional(),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must be at most 255 characters')
    .optional(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be at most 100 characters')
    .optional(),
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must be at most 100 characters')
    .optional(),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be at most 100 characters')
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;

// Invite user schema
export const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'STAFF'], {
    message: 'Please select a role',
  }),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;

// Direct create user schema (with password)
export const directCreateUserSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    role: z.enum(['ADMIN', 'STAFF', 'TRAINER'], {
      message: 'Please select a role',
    }),
    password: passwordSchema,
    specialization: z
      .string()
      .trim()
      .min(3, 'Specialization must be at least 3 characters')
      .max(200, 'Specialization is too long')
      .optional()
      .or(z.literal('')),
    bio: z
      .string()
      .max(500, 'Bio must be at most 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === 'TRAINER' &&
      (!data.specialization || data.specialization.trim().length < 3)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['specialization'],
        message: 'Specialization is required for trainers',
      });
    }
  });

export type DirectCreateUserFormData = z.infer<typeof directCreateUserSchema>;

export const directCreateTeamMemberSchema = directCreateUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type DirectCreateTeamMemberFormData = z.infer<
  typeof directCreateTeamMemberSchema
>;

// Accept invite schema
export const acceptInviteSchema = z
  .object({
    token: z.string().min(10, 'Invalid invite token'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

// Upgrade plan schema
export const upgradePlanSchema = z.object({
  planName: z.enum(['BASIC', 'PRO'], {
    message: 'Please select a plan',
  }),
  interval: z.enum(['MONTHLY', 'YEARLY'], {
    message: 'Please select a billing interval',
  }),
});

export type UpgradePlanFormData = z.infer<typeof upgradePlanSchema>;

export const updateSuperAdminProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
});

export type UpdateSuperAdminProfileFormData = z.infer<
  typeof updateSuperAdminProfileSchema
>;

export const updateSuperAdminPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UpdateSuperAdminPasswordFormData = z.infer<
  typeof updateSuperAdminPasswordSchema
>;
