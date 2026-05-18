// ===========================================
// Goals Service - Member Goals API calls
// ===========================================

import { get, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  CreateGoalRequest,
  GoalResponse,
  MemberGoalsResponse,
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
};
