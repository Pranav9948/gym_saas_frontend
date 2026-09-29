// ===========================================
// Super Admin Auth Service
// ===========================================

import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSetupRequest,
  SuperAdminSetupResponse,
  SuperAdmin,
} from '@/types';
import { API_ENDPOINTS } from '@/config/api.config';
import { get, patch, post } from '@/lib/api/client';
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

  async getMe(): Promise<{ success: true; data: SuperAdmin }> {
    return get<{ success: true; data: SuperAdmin }>(API_ENDPOINTS.SUPER_ADMIN.ME);
  },

  async updateProfile(data: {
    firstName: string;
    lastName: string;
  }): Promise<{ success: true; data: SuperAdmin }> {
    return patch<{ success: true; data: SuperAdmin }>(
      API_ENDPOINTS.SUPER_ADMIN.ME,
      data,
    );
  },

  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: true; message: string }> {
    return patch<{ success: true; message: string }>(
      API_ENDPOINTS.SUPER_ADMIN.UPDATE_PASSWORD,
      data,
    );
  },
};
