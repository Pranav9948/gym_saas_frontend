import { get } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type { SuperAdminDashboardResponse } from '@/types'

export const dashboardService = {
  get: async () => {
    return get<SuperAdminDashboardResponse>(API_ENDPOINTS.SUPER_ADMIN.DASHBOARD)
  },
}
