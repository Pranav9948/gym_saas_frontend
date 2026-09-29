import { get } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { PaginatedOwnersResponse } from '@/types';

export const superAdminOwnersService = {
  getOwners: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedOwnersResponse> => {
    return get<PaginatedOwnersResponse>(API_ENDPOINTS.SUPER_ADMIN.OWNERS, {
      page,
      limit,
    });
  },
};
