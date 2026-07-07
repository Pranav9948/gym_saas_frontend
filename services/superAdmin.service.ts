// services/superAdmin.service.ts
import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSetupRequest,
  SuperAdminSetupResponse,
} from '@/types';
import { API_ENDPOINTS } from '@/config';
import { post, refreshAccessToken } from '@/lib/api/client';
import type { RefreshTokenResponse } from '@/types';

class SuperAdminService {
  async setupSuperAdmin(
    data: SuperAdminSetupRequest,
  ): Promise<SuperAdminSetupResponse> {
    try {
      const response = await post<SuperAdminSetupResponse>(
        API_ENDPOINTS.SUPER_ADMIN.SETUP,
        data,
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshTokens(): Promise<RefreshTokenResponse> {
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      throw new Error('Failed to refresh session');
    }
    return { success: true, data: { accessToken } };
  }

  async loginSuperAdmin(
    data: SuperAdminLoginRequest,
  ): Promise<SuperAdminLoginResponse> {
    try {
      const response = await post<SuperAdminLoginResponse>(
        API_ENDPOINTS.SUPER_ADMIN.LOGIN,
        data,
        {
          withCredentials: true,
        },
      );

      if (response.success) {
        this.setToken(response.data.accessToken);
      }

      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private setToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    return new Error('An unexpected error occurred');
  }
}

export const superAdminService = new SuperAdminService();
