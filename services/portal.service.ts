import { get, patch, post, uploadFile } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MemberPortalProfileResponse,
  MemberTrainingResponse,
  MemberHistoryResponse,
  MemberWorkoutExercise,
  MemberWorkoutSession,
  PortalUserResponse,
  PortalWorkoutResponse,
  WorkoutLogCatalog,
  WorkoutPerformance,
} from '@/types';

export const portalService = {
  getMe: async (): Promise<MemberPortalProfileResponse> => {
    return get<MemberPortalProfileResponse>(API_ENDPOINTS.PORTAL.ME);
  },

  getTraining: async (date?: string): Promise<MemberTrainingResponse> => {
    return get<MemberTrainingResponse>(
      API_ENDPOINTS.PORTAL.TRAINING,
      date ? { date } : undefined,
    );
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
  }): Promise<PortalUserResponse> => {
    return patch<PortalUserResponse>(API_ENDPOINTS.PORTAL.PROFILE, data);
  },

  uploadAvatar: async (file: File): Promise<PortalUserResponse> => {
    return uploadFile<PortalUserResponse>(
      API_ENDPOINTS.PORTAL.AVATAR,
      file,
      'avatar',
    );
  },

  logActuals: async (data: {
    date: string;
    sets: Array<{
      setId: string;
      actualReps: number | null;
      actualWeight: number | null;
    }>;
  }): Promise<PortalWorkoutResponse> => {
    return patch<PortalWorkoutResponse>(API_ENDPOINTS.PORTAL.ACTUALS, data);
  },

  getHistory: async (): Promise<MemberHistoryResponse> => {
    return get<MemberHistoryResponse>(API_ENDPOINTS.PORTAL.HISTORY);
  },

  createWorkoutLog: async (data: {
    date: string;
    notes?: string;
    exercises: MemberWorkoutExercise[];
  }) => {
    return post<{ success: true; data: MemberWorkoutSession }>(
      API_ENDPOINTS.PORTAL.WORKOUT_LOGS,
      data,
    );
  },

  listWorkoutLogs: async (filters?: {
    muscleGroup?: string;
    exercise?: string;
    date?: string;
  }) => {
    return get<{ success: true; data: MemberWorkoutSession[] }>(
      API_ENDPOINTS.PORTAL.WORKOUT_LOGS,
      filters,
    );
  },

  getWorkoutCatalog: async () => {
    return get<{ success: true; data: WorkoutLogCatalog }>(
      API_ENDPOINTS.PORTAL.WORKOUT_LOG_CATALOG,
    );
  },

  getWorkoutPerformance: async (muscleGroup: string, exercise: string) => {
    return get<{ success: true; data: WorkoutPerformance }>(
      API_ENDPOINTS.PORTAL.WORKOUT_LOG_PERFORMANCE,
      { muscleGroup, exercise },
    );
  },
};
