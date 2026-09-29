'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { superAdminOwnersService } from '@/services/super-admin';
import { queryKeys } from '@/services/queryKeys';

export function useSuperAdminOwners(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.superAdmin.owners({ page, limit }),
    queryFn: () => superAdminOwnersService.getOwners(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
