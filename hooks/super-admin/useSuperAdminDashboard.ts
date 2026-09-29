'use client';

import { useQuery } from '@tanstack/react-query';
import { superAdminDashboardService } from '@/services/super-admin';
import { queryKeys } from '@/services/queryKeys';

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard(),
    queryFn: () => superAdminDashboardService.getDashboard(),
    staleTime: 30_000,
  });
}
