import { get } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type {
  PaginatedSuperAdminOwnersResponse,
  SuperAdminOwnerResponse,
} from '@/types'

export const ownersService = {
  list: async (params?: {
    page?: number
    limit?: number
    q?: string
    status?: string
  }) => {
    return get<PaginatedSuperAdminOwnersResponse>(
      API_ENDPOINTS.SUPER_ADMIN.OWNERS.LIST,
      params as Record<string, unknown>,
    )
  },

  getById: async (id: string) => {
    return get<SuperAdminOwnerResponse>(API_ENDPOINTS.SUPER_ADMIN.OWNERS.GET(id))
  },
}
