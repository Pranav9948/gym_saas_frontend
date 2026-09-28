import { get, post, put } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type { DietPlan, DietPlanMeal } from '@/types'

interface DietResponse {
  success: true
  data: DietPlan
}

interface DietListResponse {
  success: true
  data: DietPlan[]
}

export const dietsService = {
  list: async (memberId: string, date?: string) => {
    return get<DietListResponse>(
      API_ENDPOINTS.DIETS.LIST(memberId),
      date ? { date } : undefined,
    )
  },

  save: async (
    memberId: string,
    data: {
      date: string
      notes?: string
      publish?: boolean
      meals: DietPlanMeal[]
    },
  ) => {
    return put<DietResponse>(API_ENDPOINTS.DIETS.UPSERT(memberId), data)
  },

  publish: async (memberId: string, date: string) => {
    return post<DietResponse>(API_ENDPOINTS.DIETS.PUBLISH(memberId), { date })
  },
}
