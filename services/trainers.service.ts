// ===========================================
// Trainers Service - Trainer API calls
// ===========================================

import { get, post, patch, del } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  PaginationParams,
  PaginatedTrainersResponse,
  TrainerResponse,
  TrainerMembersResponse,
  TrainerOverviewResponse,
  TrainerPerformanceResponse,
  CreateTrainerRequest,
  UpdateTrainerRequest,
} from '@/types';

interface ApiSuccessResponse {
  success: true;
  message?: string;
}

export const trainersService = {
  /**
   * Get paginated list of trainers
   */
  getTrainers: async (
    params?: PaginationParams,
  ): Promise<PaginatedTrainersResponse> => {
    return get<PaginatedTrainersResponse>(
      API_ENDPOINTS.TRAINERS.LIST,
      params as Record<string, unknown>,
    );
  },

  /**
   * Get a single trainer by ID
   */
  getTrainer: async (id: string): Promise<TrainerResponse> => {
    return get<TrainerResponse>(API_ENDPOINTS.TRAINERS.GET(id));
  },

  /**
   * Create a new trainer
   * Note: Enforces plan maxTrainers limit
   */
  createTrainer: async (
    data: CreateTrainerRequest,
  ): Promise<TrainerResponse> => {
    const cleanData = {
      ...data,
      bio: data.bio || undefined,
    };
    return post<TrainerResponse>(API_ENDPOINTS.TRAINERS.CREATE, cleanData);
  },

  /**
   * Update a trainer
   */
  updateTrainer: async (
    id: string,
    data: UpdateTrainerRequest,
  ): Promise<TrainerResponse> => {
    const cleanData = {
      ...data,
      bio: data.bio || undefined,
    };
    return patch<TrainerResponse>(API_ENDPOINTS.TRAINERS.UPDATE(id), cleanData);
  },

  /**
   * Delete a trainer
   */
  deleteTrainer: async (id: string): Promise<ApiSuccessResponse> => {
    return del<ApiSuccessResponse>(API_ENDPOINTS.TRAINERS.DELETE(id));
  },

  /**
   * Get members assigned to a trainer
   */
  getTrainerMembers: async (
    id: string,
    params?: PaginationParams,
  ): Promise<TrainerMembersResponse> => {
    return get<TrainerMembersResponse>(
      API_ENDPOINTS.TRAINERS.MEMBERS(id),
      params as Record<string, unknown>,
    );
  },

  getOverview: async (): Promise<TrainerOverviewResponse> => {
    return get<TrainerOverviewResponse>(API_ENDPOINTS.TRAINERS.OVERVIEW);
  },

  getPerformance: async (
    id: string,
    params?: { range?: 'this_month' | 'last_month' | 'custom'; from?: string; to?: string },
  ): Promise<TrainerPerformanceResponse> => {
    return get<TrainerPerformanceResponse>(
      API_ENDPOINTS.TRAINERS.PERFORMANCE(id),
      params as Record<string, unknown>,
    );
  },
};
