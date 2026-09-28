import { get } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type { SuperAdminBillingResponse } from '@/types'

export const billingService = {
  get: async () => {
    return get<SuperAdminBillingResponse>(API_ENDPOINTS.SUPER_ADMIN.BILLING)
  },
}
