// ===========================================
// Tenant Service - Tenant/Gym API calls
// ===========================================

import { get, post, patch, uploadFile, del } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  TenantResponse,
  UpdateTenantRequest,
  InviteUserRequest,
  DirectCreateUserRequest,
  AcceptInviteRequest,
  UpgradePlanRequest,
  TeamMembersResponse,
  PendingInvitesResponse,
  InvitePreviewResponse,
  AcceptInviteResponse,
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
    role: string;
    trainerId?: string;
    specialization?: string | null;
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
   * List team members for the current tenant
   */
  listTeamMembers: async (): Promise<TeamMembersResponse> => {
    return get<TeamMembersResponse>(API_ENDPOINTS.TENANT.LIST_USERS);
  },

  /**
   * List pending team invites
   */
  listPendingInvites: async (): Promise<PendingInvitesResponse> => {
    return get<PendingInvitesResponse>(API_ENDPOINTS.TENANT.LIST_INVITES);
  },

  /**
   * Preview invite details from email link (public)
   */
  getInvitePreview: async (token: string): Promise<InvitePreviewResponse> => {
    return get<InvitePreviewResponse>(API_ENDPOINTS.TENANT.INVITE_PREVIEW, {
      token,
    });
  },

  /**
   * Cancel a pending invite
   */
  cancelInvite: async (inviteId: string): Promise<ApiSuccessResponse> => {
    return del<ApiSuccessResponse>(API_ENDPOINTS.TENANT.CANCEL_INVITE(inviteId));
  },

  /**
   * Invite a user to the tenant
   */
  inviteUser: async (data: InviteUserRequest): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.TENANT.INVITE_USER, data);
  },

  /**
   * Accept an invitation (public — sets refresh cookie on success)
   */
  acceptInvite: async (
    data: AcceptInviteRequest,
  ): Promise<AcceptInviteResponse> => {
    return post<AcceptInviteResponse>(API_ENDPOINTS.TENANT.ACCEPT_INVITE, data);
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
