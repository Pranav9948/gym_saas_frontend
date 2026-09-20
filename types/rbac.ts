// ===========================================
// RBAC Types
// ===========================================

export interface PermissionDto {
  id: string;
  name: string;
  description: string | null;
}

export interface RolePermissionDto {
  id: string;
  name: string;
  description: string | null;
}

export interface RoleDto {
  id: string;
  name: string;
  tenantId: string;
  isSystem: boolean;
  isProtected: boolean;
  userCount: number;
  permissions: RolePermissionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PermissionsListResponse {
  success: true;
  data: PermissionDto[];
}

export interface RolesListResponse {
  success: true;
  data: RoleDto[];
}

export interface RoleResponse {
  success: true;
  message?: string;
  data: RoleDto;
}

export interface CreateRoleRequest {
  name: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  permissionIds?: string[];
}

export interface ApiSuccessResponse {
  success: true;
  message?: string;
}
