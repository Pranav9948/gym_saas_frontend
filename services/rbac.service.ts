// ===========================================
// RBAC Service - Roles & Permissions API
// ===========================================

import { del, get, post, put } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  ApiSuccessResponse,
  CreateRoleRequest,
  PermissionsListResponse,
  RoleResponse,
  RolesListResponse,
  UpdateRoleRequest,
} from '@/types/rbac';

export const rbacService = {
  getPermissions: async (): Promise<PermissionsListResponse> => {
    return get<PermissionsListResponse>(API_ENDPOINTS.RBAC.PERMISSIONS);
  },

  getRoles: async (tenantId: string): Promise<RolesListResponse> => {
    return get<RolesListResponse>(API_ENDPOINTS.RBAC.ROLES.LIST(tenantId));
  },

  createRole: async (
    tenantId: string,
    data: CreateRoleRequest,
  ): Promise<RoleResponse> => {
    return post<RoleResponse>(API_ENDPOINTS.RBAC.ROLES.CREATE(tenantId), data);
  },

  updateRole: async (
    tenantId: string,
    roleId: string,
    data: UpdateRoleRequest,
  ): Promise<RoleResponse> => {
    return put<RoleResponse>(
      API_ENDPOINTS.RBAC.ROLES.UPDATE(tenantId, roleId),
      data,
    );
  },

  deleteRole: async (
    tenantId: string,
    roleId: string,
  ): Promise<ApiSuccessResponse> => {
    return del<ApiSuccessResponse>(
      API_ENDPOINTS.RBAC.ROLES.DELETE(tenantId, roleId),
    );
  },
};
