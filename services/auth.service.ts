// ===========================================
// Auth Service - Authentication API calls
// ===========================================

import { post, get } from '@/lib/api/client';
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
} from '@/types';

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
    return get<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH);
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Reset password with token
   * Note: Backend has a bug here (uses req.user without auth middleware)
   */
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ApiSuccessResponse> => {
    return post<ApiSuccessResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};
