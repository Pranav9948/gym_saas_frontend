// ===========================================
// Super Admin Auth Service
// ===========================================

import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSetupRequest,
  SuperAdminSetupResponse,
} from '@/types';
import { API_ENDPOINTS } from '@/config/api.config';
import { post } from '@/lib/api/client';
import { setAccessToken } from '@/lib/api/client';

export const superAdminAuthService = {
  /**
   * Setup initial super admin account
   */
  async setupSuperAdmin(data: SuperAdminSetupRequest): Promise<SuperAdminSetupResponse> {
    return await post<SuperAdminSetupResponse>(API_ENDPOINTS.SUPER_ADMIN.SETUP, data);
  },

  /**
   * Login super admin
   */
  async loginSuperAdmin(data: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> {
    const response = await post<SuperAdminLoginResponse>(
      API_ENDPOINTS.SUPER_ADMIN.LOGIN,
      data,
      { withCredentials: true }
    );

    if (response.success && response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }

    return response;
  },
};
