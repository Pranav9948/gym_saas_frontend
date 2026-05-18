// ===========================================
// Attendance Schemas - Zod validation schemas
// ===========================================

import { z } from 'zod';

// Mark attendance schema
export const markAttendanceSchema = z.object({
  memberId: z.string().uuid('Please select a member'),
  deviceInfo: z.string().optional(),
});

export type MarkAttendanceFormData = z.infer<typeof markAttendanceSchema>;

// Attendance date query schema (for history)
export const attendanceQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type AttendanceQueryParams = z.infer<typeof attendanceQuerySchema>;

// Member stats param schema
export const memberStatsSchema = z.object({
  id: z.string().uuid('Invalid member ID'),
});

export type MemberStatsParams = z.infer<typeof memberStatsSchema>;
