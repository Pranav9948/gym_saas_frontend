// ===========================================
// Goals Service - Member Goals API calls
// ===========================================

import { get, patch, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  CreateGoalRequest,
  GoalResponse,
  MemberGoalsResponse,
  WeightLog,
} from '@/types';

export const goalsService = {
  /**
   * Create a goal for a member
   * Service rules:
   * - LOSS: target < current, max 1 kg/week
   * - GAIN: target > current, max 0.5 kg/week
   */
  createGoal: async (
    memberId: string,
    data: CreateGoalRequest,
  ): Promise<GoalResponse> => {
    return post<GoalResponse>(API_ENDPOINTS.GOALS.CREATE(memberId), data);
  },

  /**
   * Get goals for a member
   * Note: No permission middleware on backend - any authenticated user can access
   */
  getMemberGoals: async (memberId: string): Promise<MemberGoalsResponse> => {
    return get<MemberGoalsResponse>(API_ENDPOINTS.GOALS.LIST(memberId));
  },

  updateTargets: async (
    memberId: string,
    weeklyTargets: Array<{
      week: number;
      targetChangeKg: number;
      targetWeightKg: number;
    }>,
  ): Promise<GoalResponse> => {
    return patch<GoalResponse>(API_ENDPOINTS.GOALS.TARGETS(memberId), {
      weeklyTargets,
    });
  },

  listWeights: async (
    memberId: string,
  ): Promise<{ success: true; data: WeightLog[] }> => {
    return get(API_ENDPOINTS.GOALS.WEIGHTS(memberId));
  },
};
