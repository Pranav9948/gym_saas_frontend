import { get, patch } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type { PaginatedGymsResponse, SuperAdminGymResponse } from '@/types'

export const gymsService = {
  list: async (params?: {
    page?: number
    limit?: number
    q?: string
    status?: string
  }) => {
    return get<PaginatedGymsResponse>(
      API_ENDPOINTS.SUPER_ADMIN.GYMS.LIST,
      params as Record<string, unknown>,
    )
  },

  setActive: async (id: string, isActive: boolean) => {
    return patch<SuperAdminGymResponse>(API_ENDPOINTS.SUPER_ADMIN.GYMS.UPDATE(id), {
      isActive,
    })
  },
}
