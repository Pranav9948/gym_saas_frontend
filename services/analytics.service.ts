// ===========================================
// Analytics Service - Dashboard stats (future)
// ===========================================

// Note: Backend only has a background job for analytics aggregation
// No dedicated analytics API endpoints exist yet
// This service will be expanded when backend endpoints are available

import type { Member, Attendance } from '@/types';

// Temporary client-side analytics helpers
export const analyticsService = {
  /**
   * Calculate member growth stats from member list
   * Client-side aggregation until backend provides dedicated endpoints
   */
  calculateMemberStats: (members: Member[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'ACTIVE').length;
    const newThisMonth = members.filter(
      (m) => new Date(m.createdAt) >= thisMonth,
    ).length;
    const newLastMonth = members.filter(
      (m) =>
        new Date(m.createdAt) >= lastMonth && new Date(m.createdAt) < thisMonth,
    ).length;

    const growthRate =
      newLastMonth > 0
        ? ((newThisMonth - newLastMonth) / newLastMonth) * 100
        : 0;

    return {
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      newThisMonth,
      newLastMonth,
      growthRate: Math.round(growthRate),
    };
  },

  /**
   * Calculate attendance stats from attendance records
   */
  calculateAttendanceStats: (attendance: Attendance[]) => {
    const totalCheckIns = attendance.length;
    const uniqueMembers = new Set(attendance.map((a) => a.member?.email)).size;

    // Group by hour for peak time analysis
    const hourCounts: Record<number, number> = {};
    attendance.forEach((a) => {
      const hour = new Date(a.checkIn).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourCounts).sort(
      ([, a], [, b]) => b - a,
    )[0];

    return {
      totalCheckIns,
      uniqueMembers,
      averagePerMember:
        uniqueMembers > 0 ? Math.round(totalCheckIns / uniqueMembers) : 0,
      peakHour: peakHour ? parseInt(peakHour[0]) : null,
      peakHourCount: peakHour ? peakHour[1] : 0,
    };
  },

  /**
   * Group data by date for chart display
   */
  groupByDate: <T extends { createdAt: string }>(
    items: T[],
    days: number = 30,
  ): Record<string, number> => {
    const result: Record<string, number> = {};
    const now = new Date();

    // Initialize all dates with 0
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      result[key] = 0;
    }

    // Count items per date
    items.forEach((item) => {
      const date = new Date(item.createdAt).toISOString().split('T')[0];
      if (result[date] !== undefined) {
        result[date]++;
      }
    });

    return result;
  },
};
