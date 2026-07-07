import { apiClient } from '@/lib/api';
import { Plan } from '@/types';
import {
  CreatePlanRequest,
  UpdatePlanRequest,
  PlansResponse,
  PlanResponse,
  DeletePlanResponse,
} from '@/types/plans';

const PLANS_API_BASE = '/super-admin/plan';

export const plansService = {
  /**
   * Get all plans
   */

  async getAllPlans(): Promise<Plan[]> {
    try {
      const response = await apiClient.get<PlansResponse>(
        `${PLANS_API_BASE}/get-all-plans`,
      );
      return response.data.data;
    } catch (error) {
      console.error('[PlansService] Error fetching plans:', error);
      throw error;
    }
  },

  /**
   * Get single plan by ID
   */

  async getPlanById(id: string): Promise<Plan> {
    try {
      const response = await apiClient.get<PlanResponse>(
        `${PLANS_API_BASE}/${id}`,
      );
      return response.data.data;
    } catch (error) {
      console.error('[PlansService] Error fetching plan:', error);
      throw error;
    }
  },

  /**
   * Create a new plan
   */

  async createPlan(data: CreatePlanRequest): Promise<Plan> {
    try {
      const response = await apiClient.post<PlanResponse>(
        `${PLANS_API_BASE}/create-plan`,
        data,
      );
      return response.data.data;
    } catch (error) {
      console.error('[PlansService] Error creating plan:', error);
      throw error;
    }
  },

  /**
   * Update an existing plan
   */

  async updatePlan(id: string, data: UpdatePlanRequest): Promise<Plan> {
    try {
      const response = await apiClient.patch<PlanResponse>(
        `${PLANS_API_BASE}/update-plan/${id}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      console.error('[PlansService] Error updating plan:', error);
      throw error;
    }
  },

  /**
   * Delete a plan
   */

  async deletePlan(id: string): Promise<DeletePlanResponse> {
    try {
      const response = await apiClient.delete<DeletePlanResponse>(
        `${PLANS_API_BASE}/delete-plan/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error('[PlansService] Error deleting plan:', error);
      throw error;
    }
  },
};
