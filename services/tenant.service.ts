// ===========================================
// Tenant Service - Tenant/Gym API calls
// ===========================================

import { get, post, patch, uploadFile } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  TenantResponse,
  UpdateTenantRequest,
  InviteUserRequest,
  DirectCreateUserRequest,
  AcceptInviteRequest,
  UpgradePlanRequest,
} from '@/types';

interface ApiSuccessResponse {
  success: true;
  message?: string;
  data?: unknown;
}

interface DirectCreateUserResponse {
  success: true;
  message?: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const tenantService = {
  /**
   * Get current tenant info
   */
  getTenant: async (): Promise<TenantResponse> => {
    return get<TenantResponse>(API_ENDPOINTS.TENANT.GET);
  },

  /**
   * Update tenant settings
   * Note: Backend validation may have issues (no body wrapper)
   */
  updateTenant: async (data: UpdateTenantRequest): Promise<TenantResponse> => {
    return patch<TenantResponse>(API_ENDPOINTS.TENANT.UPDATE, data);
  },

  /**
   * Upload tenant logo
   * Accepts PNG, JPEG, WEBP, max 2MB
   */
  uploadLogo: async (file: File): Promise<ApiSuccessResponse> => {
    return uploadFile<ApiSuccessResponse>(
      API_ENDPOINTS.TENANT.UPLOAD_LOGO,
      file,
      'logo',
    );
  },

  /**
   * Invite a user to the tenant
   */
  inviteUser: async (data: InviteUserRequest): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.TENANT.INVITE_USER, data);
  },

  /**
   * Accept an invitation
   * Note: Backend requires auth which is unusual for invite acceptance
   */
  acceptInvite: async (
    data: AcceptInviteRequest,
  ): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.TENANT.ACCEPT_INVITE, data);
  },

  /**
   * Create a user directly (with password, no email invite)
   */
  createUser: async (
    data: DirectCreateUserRequest,
  ): Promise<DirectCreateUserResponse> => {
    return post<DirectCreateUserResponse>(API_ENDPOINTS.TENANT.CREATE_USER, data);
  },

  /**
   * Upgrade tenant subscription plan
   */
  upgradePlan: async (
    data: UpgradePlanRequest,
  ): Promise<ApiSuccessResponse> => {
    return patch<ApiSuccessResponse>(API_ENDPOINTS.TENANT.UPGRADE_PLAN, data);
  },
};
