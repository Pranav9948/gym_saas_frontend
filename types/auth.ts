// ===========================================
// Auth Types - Authentication related types
// ===========================================

import type {
  User,
  Tenant,
  TenantRole,
  InviteRole,
  DirectCreateRole,
  BillingInterval,
} from './models';

// JWT Payload
export interface AccessTokenPayload {
  userId: string;
  tenantId: string;
  roleId: string;
  role: TenantRole;
}

// Request DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterGymRequest {
  gymName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: InviteRole;
}

export interface DirectCreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: DirectCreateRole;
  password: string;
  specialization?: string;
  bio?: string;
}

export interface AcceptInviteRequest {
  token: string;
  password: string;
}

export interface UpgradePlanRequest {
  planName: 'BASIC' | 'PRO';
  interval: BillingInterval;
}

// Response Types

/** Login response - note: NO `success` wrapper */

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  tenant?: Tenant;
}

/** Generic auth response with success wrapper */

export interface AuthResponse {
  success: true;
  data: {
    accessToken: string;
    user?: User;
    tenant?: Tenant;
  };
  message?: string;
}

export interface RegisterGymResponse {
  success: true;
  message: string;
  data: {
    user: User;
    accessToken: string;
    tenant: Tenant;
  };
}

export interface RefreshTokenResponse {
  success: true;
  data: {
    accessToken: string;
  };
}

export interface MeResponse {
  success: true;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string | null;
    tenant?: Tenant | null;
  };
}

// Auth State
export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
}

export interface SuperAdminSetupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface SuperAdminSetupResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    message: string;
  };
}

export interface SuperAdminLoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    superAdmin: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
  statusCode?: number;
}
