// ===========================================
// Attendance Service - Attendance API calls
// ===========================================

import { get, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MarkAttendanceRequest,
  AttendanceResponse,
  TodayAttendanceResponse,
  AttendanceHistoryResponse,
  AttendanceStatsResponse,
} from '@/types';

export const attendanceService = {
  /**
   * Mark attendance for a member (check-in)
   */
  markAttendance: async (
    data: MarkAttendanceRequest,
  ): Promise<AttendanceResponse> => {
    const cleanData = {
      ...data,
      deviceInfo: data.deviceInfo || undefined,
    };
    return post<AttendanceResponse>(API_ENDPOINTS.ATTENDANCE.MARK, cleanData);
  },

  /**
   * Get today's attendance records
   */
  getTodayAttendance: async (): Promise<TodayAttendanceResponse> => {
    return get<TodayAttendanceResponse>(API_ENDPOINTS.ATTENDANCE.TODAY);
  },

  /**
   * Get attendance history for a specific date
   * @param date - Date in YYYY-MM-DD format
   */
  getAttendanceHistory: async (
    date: string,
  ): Promise<AttendanceHistoryResponse> => {
    return get<AttendanceHistoryResponse>(API_ENDPOINTS.ATTENDANCE.HISTORY, {
      date,
    });
  },

  /**
   * Get attendance statistics for a member
   */
  getMemberStats: async (
    memberId: string,
  ): Promise<AttendanceStatsResponse> => {
    return get<AttendanceStatsResponse>(
      API_ENDPOINTS.ATTENDANCE.STATS(memberId),
    );
  },
};
