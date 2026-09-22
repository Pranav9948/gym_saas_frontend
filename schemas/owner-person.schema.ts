import { z } from 'zod';
import { passwordSchema } from './auth.schema';

const personBaseSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const passwordFieldsSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
});

export const addMemberPersonSchema = personBaseSchema.extend({
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number (E.164 format)')
    .optional()
    .or(z.literal('')),
  assignedTrainerId: z.string().uuid('Invalid trainer').optional().or(z.literal('')),
  packageId: z.string().uuid('Please select a package'),
  paymentStatus: z.enum(['PAID', 'PENDING']),
});

export const editMemberPersonSchema = addMemberPersonSchema.omit({
  paymentStatus: true,
});

export const addStaffPersonSchema = personBaseSchema
  .merge(passwordFieldsSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const addAdminPersonSchema = addStaffPersonSchema;

export const addTrainerPersonSchema = personBaseSchema
  .merge(passwordFieldsSchema)
  .extend({
    specialization: z
      .string()
      .trim()
      .min(3, 'Specialization must be at least 3 characters'),
    bio: z
      .string()
      .max(500, 'Bio must be at most 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AddMemberPersonFormData = z.infer<typeof addMemberPersonSchema>;
export type EditMemberPersonFormData = z.infer<typeof editMemberPersonSchema>;
export type AddStaffPersonFormData = z.infer<typeof addStaffPersonSchema>;
export type AddAdminPersonFormData = z.infer<typeof addAdminPersonSchema>;
export type AddTrainerPersonFormData = z.infer<typeof addTrainerPersonSchema>;

export type PersonType = 'member' | 'staff' | 'admin' | 'trainer';
