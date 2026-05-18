// ===========================================
// Auth Schemas - Zod validation schemas
// ===========================================

import { z } from 'zod';

// Shared password schema matching backend rules
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character')
  .refine((v) => !v.includes(' '), 'Password cannot contain spaces');

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register gym schema
export const registerGymSchema = z
  .object({
    gymName: z
      .string()
      .trim()
      .min(2, 'Gym name must be at least 2 characters')
      .max(100, 'Gym name must be at most 100 characters'),
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be at most 50 characters'),
    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be at most 50 characters'),
    email: z.string().email('Please enter a valid email address').toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string(),
    contactPhone: z
      .string()
      .min(8, 'Phone number must be at least 8 characters')
      .max(15, 'Phone number must be at most 15 characters')
      .regex(/^[0-9+\-() ]+$/, 'Phone number contains invalid characters'),
    contactEmail: z.string().email('Please enter a valid contact email'),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters')
      .max(255, 'Address must be at most 255 characters'),
    city: z
      .string()
      .min(2, 'City must be at least 2 characters')
      .max(100, 'City must be at most 100 characters'),
    country: z
      .string()
      .min(2, 'Country must be at least 2 characters')
      .max(100, 'Country must be at most 100 characters'),
    timezone: z.string().min(2).max(100).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterGymFormData = z.infer<typeof registerGymSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
