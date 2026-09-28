import { get, put } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  LastWorkoutPerformance,
  WorkoutSession,
  WorkoutSessionExercise,
} from '@/types/api';

interface WorkoutResponse {
  success: true;
  data: WorkoutSession;
}

interface WorkoutListResponse {
  success: true;
  data: WorkoutSession[];
}

export const workoutsService = {
  list: async (memberId: string, date?: string) => {
    return get<WorkoutListResponse>(
      API_ENDPOINTS.WORKOUTS.LIST(memberId),
      date ? { date } : undefined,
    );
  },

  lastPerformance: async (memberId: string, before?: string) => {
    return get<{ success: true; data: LastWorkoutPerformance }>(
      API_ENDPOINTS.WORKOUTS.LAST_PERFORMANCE(memberId),
      before ? { before } : undefined,
    );
  },

  save: async (
    memberId: string,
    data: {
      date: string;
      notes?: string;
      exercises: WorkoutSessionExercise[];
    },
  ) => {
    return put<WorkoutResponse>(API_ENDPOINTS.WORKOUTS.UPSERT(memberId), data);
  },
};
