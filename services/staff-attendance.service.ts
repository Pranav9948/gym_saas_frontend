import { get, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { StaffMetricsResponse } from '@/types';

export const staffAttendanceService = {
  getMetrics: async (params?: {
    range?: 'this_month' | 'last_month' | 'custom';
    from?: string;
    to?: string;
  }): Promise<StaffMetricsResponse> => {
    return get<StaffMetricsResponse>(
      API_ENDPOINTS.STAFF_ATTENDANCE.METRICS,
      params as Record<string, unknown>,
    );
  },

  mark: async (data: {
    userId: string;
    date: string;
    present?: boolean;
    notes?: string;
  }) => {
    return post(API_ENDPOINTS.STAFF_ATTENDANCE.MARK, data);
  },

  listByDate: async (date: string): Promise<{
    success: true;
    data: Array<{
      id: string;
      userId: string;
      trainerId: string | null;
      date: string;
      present: boolean;
      checkIn: string;
      notes: string | null;
      firstName: string;
      lastName: string;
      email: string;
    }>;
  }> => {
    return get(API_ENDPOINTS.STAFF_ATTENDANCE.LIST, { date });
  },
};
