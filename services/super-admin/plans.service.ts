// ===========================================
// Super Admin Plans Service
// ===========================================

import { apiClient } from '@/lib/api';
import { Plan } from '@/types';
import {
  CreatePlanRequest,
  UpdatePlanRequest,
  PlansResponse,
  PlanResponse,
  DeletePlanResponse,
} from '@/types/plans';
import { API_ENDPOINTS } from '@/config/api.config';

export const plansService = {
  /**
   * Get all plans
   */
  async getAllPlans(): Promise<Plan[]> {
    const response = await apiClient.get<PlansResponse>(API_ENDPOINTS.SUPER_ADMIN.PLANS.LIST);
    return response.data.data;
  },

  /**
   * Get single plan by ID
   */
  async getPlanById(id: string): Promise<Plan> {
    const response = await apiClient.get<PlanResponse>(API_ENDPOINTS.SUPER_ADMIN.PLANS.GET(id));
    return response.data.data;
  },

  /**
   * Create a new plan
   */
  async createPlan(data: CreatePlanRequest): Promise<Plan> {
    const response = await apiClient.post<PlanResponse>(API_ENDPOINTS.SUPER_ADMIN.PLANS.CREATE, data);
    return response.data.data;
  },

  /**
   * Update an existing plan
   */
  async updatePlan(id: string, data: UpdatePlanRequest): Promise<Plan> {
    const response = await apiClient.patch<PlanResponse>(API_ENDPOINTS.SUPER_ADMIN.PLANS.UPDATE(id), data);
    return response.data.data;
  },

  /**
   * Delete a plan
   */
  async deletePlan(id: string): Promise<DeletePlanResponse> {
    const response = await apiClient.delete<DeletePlanResponse>(API_ENDPOINTS.SUPER_ADMIN.PLANS.DELETE(id));
    return response.data;
  },
};
