// ===========================================
// Super Admin Auth Service
// ===========================================

import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSetupRequest,
  SuperAdminSetupResponse,
  SuperAdminProfileResponse,
  SuperAdminSessionActionResponse,
  PasswordResetCodesResponse,
} from '@/types';
import { API_ENDPOINTS } from '@/config/api.config';
import { get, patch, post } from '@/lib/api/client';
import { setAccessToken } from '@/lib/api/client';

export const superAdminAuthService = {
  async setupSuperAdmin(data: SuperAdminSetupRequest): Promise<SuperAdminSetupResponse> {
    return await post<SuperAdminSetupResponse>(API_ENDPOINTS.SUPER_ADMIN.SETUP, data);
  },

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

  getMe: async () => {
    return get<SuperAdminProfileResponse>(API_ENDPOINTS.SUPER_ADMIN.ME);
  },

  updateProfile: async (data: { firstName: string; lastName: string }) => {
    return patch<SuperAdminProfileResponse>(API_ENDPOINTS.SUPER_ADMIN.ME, data);
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return post<SuperAdminSessionActionResponse>(
      API_ENDPOINTS.SUPER_ADMIN.CHANGE_PASSWORD,
      data,
    );
  },

  logoutOtherSessions: async () => {
    return post<SuperAdminSessionActionResponse>(
      API_ENDPOINTS.SUPER_ADMIN.LOGOUT_OTHER_SESSIONS,
    );
  },

  listResetCodes: async () => {
    return get<PasswordResetCodesResponse>(
      API_ENDPOINTS.SUPER_ADMIN.RESET_CODES,
    );
  },
};
