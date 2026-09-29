import { get } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type { SuperAdminAnalyticsResponse } from '@/types'

export const analyticsService = {
  get: async () => {
    return get<SuperAdminAnalyticsResponse>(API_ENDPOINTS.SUPER_ADMIN.ANALYTICS)
  },
}
