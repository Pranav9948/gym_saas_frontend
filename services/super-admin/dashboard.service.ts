import { get } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { SuperAdminDashboardResponse } from '@/types/super-admin-dashboard';

export const superAdminDashboardService = {
  getDashboard: async (): Promise<SuperAdminDashboardResponse> => {
    return get<SuperAdminDashboardResponse>(API_ENDPOINTS.SUPER_ADMIN.DASHBOARD);
  },
};
