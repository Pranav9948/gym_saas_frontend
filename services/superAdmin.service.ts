// services/superAdmin.service.ts - DEPRECATED: Use services/super-admin/auth.service.ts instead
import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSetupRequest,
  SuperAdminSetupResponse,
} from '@/types';
import { API_ENDPOINTS } from '@/config';
import { post } from '@/lib/api/client';
import { setAccessToken } from '@/lib/api/client';

class SuperAdminService {
  async setupSuperAdmin(
    data: SuperAdminSetupRequest,
  ): Promise<SuperAdminSetupResponse> {
    return await post<SuperAdminSetupResponse>(
      API_ENDPOINTS.SUPER_ADMIN.SETUP,
      data,
    );
  }

  async loginSuperAdmin(
    data: SuperAdminLoginRequest,
  ): Promise<SuperAdminLoginResponse> {
    const response = await post<SuperAdminLoginResponse>(
      API_ENDPOINTS.SUPER_ADMIN.LOGIN,
      data,
      {
        withCredentials: true,
      },
    );

    if (response.success) {
      setAccessToken(response.data.accessToken);
    }

    return response;
  }
}

export const superAdminService = new SuperAdminService();
