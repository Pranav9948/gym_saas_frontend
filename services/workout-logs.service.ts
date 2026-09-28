import { get } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type {
  MemberWorkoutSession,
  WorkoutLogCatalog,
  WorkoutPerformance,
} from '@/types'

export const workoutLogsService = {
  list: async (
    memberId: string,
    filters?: { muscleGroup?: string; exercise?: string; date?: string },
  ) => {
    return get<{ success: true; data: MemberWorkoutSession[] }>(
      API_ENDPOINTS.WORKOUT_LOGS.LIST(memberId),
      filters,
    )
  },

  catalog: async (memberId: string) => {
    return get<{ success: true; data: WorkoutLogCatalog }>(
      API_ENDPOINTS.WORKOUT_LOGS.CATALOG(memberId),
    )
  },

  performance: async (
    memberId: string,
    muscleGroup: string,
    exercise: string,
  ) => {
    return get<{ success: true; data: WorkoutPerformance }>(
      API_ENDPOINTS.WORKOUT_LOGS.PERFORMANCE(memberId),
      { muscleGroup, exercise },
    )
  },
}
