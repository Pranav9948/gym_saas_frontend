// ===========================================
// Auth Service - Authentication API calls
// ===========================================

import { post, get, refreshAccessToken } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  LoginRequest,
  LoginResponse,
  RegisterGymRequest,
  RegisterGymResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenResponse,
  MeResponse,
  SuperAdminSetupRequest,
  PasswordResetCodesResponse,
} from '@/types';
import { SuperAdminLoginResponse } from '@/types/api';

interface ApiSuccessResponse {
  success: true;
  message?: string;
}

export const authService = {
  /**
   * Login with email and password
   * Note: Response has no `success` wrapper (different from other endpoints)
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * Register a new gym with owner
   */
  registerGym: async (
    data: RegisterGymRequest,
  ): Promise<RegisterGymResponse> => {
    // Remove confirmPassword before sending to API
    const { ...requestData } = data;
    return post<RegisterGymResponse>(
      API_ENDPOINTS.AUTH.REGISTER_GYM,
      requestData,
    );
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Get current user info
   */
  getMe: async (): Promise<MeResponse> => {
    return get<MeResponse>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Refresh access token using httpOnly cookie
   */
  refreshTokens: async (): Promise<RefreshTokenResponse> => {
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      throw new Error('Failed to refresh session');
    }
    return { success: true, data: { accessToken } };
  },

  /**
   * Request a 6-digit reset code (shown to the parent portal)
   */
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Reset password with email + 6-digit code
   */
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  listResetCodes: async () => {
    return get<PasswordResetCodesResponse>(
      API_ENDPOINTS.AUTH.RESET_CODES,
    );
  },
};
