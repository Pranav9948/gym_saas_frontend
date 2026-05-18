// ===========================================
// Goal Schemas - Zod validation schemas
// ===========================================

import { z } from 'zod';

// Create goal schema
export const createGoalSchema = z
  .object({
    goalType: z.enum(['GAIN', 'LOSS'], {
      message: 'Please select a goal type',
    }),
    currentWeight: z
      .number({ message: 'Current weight is required' })
      .positive('Current weight must be positive'),
    targetWeight: z
      .number({ message: 'Target weight is required' })
      .positive('Target weight must be positive'),
    durationWeeks: z
      .number({ message: 'Duration is required' })
      .int('Duration must be a whole number')
      .min(1, 'Duration must be at least 1 week')
      .max(52, 'Duration must be at most 52 weeks'),
    height: z
      .number({ message: 'Height is required' })
      .positive('Height must be positive'),
  })
  .superRefine((data, ctx) => {
    // Service rules: LOSS → target < current; GAIN → target > current
    if (data.goalType === 'LOSS' && data.targetWeight >= data.currentWeight) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Target weight must be less than current weight for weight loss',
        path: ['targetWeight'],
      });
    }
    if (data.goalType === 'GAIN' && data.targetWeight <= data.currentWeight) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Target weight must be greater than current weight for weight gain',
        path: ['targetWeight'],
      });
    }

    // Max 1 kg/week loss, 0.5 kg/week gain
    const weightDiff = Math.abs(data.targetWeight - data.currentWeight);
    const weeklyChange = weightDiff / data.durationWeeks;

    if (data.goalType === 'LOSS' && weeklyChange > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Maximum safe weight loss is 1 kg per week. Increase duration or reduce target.',
        path: ['durationWeeks'],
      });
    }
    if (data.goalType === 'GAIN' && weeklyChange > 0.5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Maximum safe weight gain is 0.5 kg per week. Increase duration or reduce target.',
        path: ['durationWeeks'],
      });
    }
  });

export type CreateGoalFormData = z.infer<typeof createGoalSchema>;

// Member ID param for goals
export const goalMemberIdSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
});

export type GoalMemberIdParams = z.infer<typeof goalMemberIdSchema>;
