'use client';

// ===========================================
// useAuth Hook - Auth utilities and permission checks
// ===========================================

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/config/routes';
import type { TenantRole } from '@/types';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    tenant,
    isAuthenticated,
    isLoading,
    isInitialized,
    permissions,
    setAuth,
    setLoading,
    logout: clearAuth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuthStore();

  // Login handler
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await authService.login({ email, password });

        if (response.accessToken && response.user) {
          setAuth(response.user, null, response.accessToken);
          toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
          router.push(ROUTES.DASHBOARD);
          return { success: true };
        }

        return { success: false, error: ERROR_MESSAGES.LOGIN_FAILED };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED;
        toast.error(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading, router],
  );

  // Register handler
  const register = useCallback(
    async (data: Parameters<typeof authService.registerGym>[0]) => {
      setLoading(true);
      try {
        const response = await authService.registerGym(data);

        if (response.success && response.data) {
          setAuth(
            response.data.user,
            response.data.tenant,
            response.data.accessToken,
          );
          toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
          router.push(ROUTES.DASHBOARD);
          return { success: true };
        }

        return { success: false, error: 'Registration failed' };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SOMETHING_WENT_WRONG;
        toast.error(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading, router],
  );

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth();
      toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
      router.push(ROUTES.LOGIN);
    }
  }, [clearAuth, router]);

  // Forgot password handler
  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await authService.forgotPassword({ email });
      if (response.success) {
        toast.success(SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL);
        return { success: true };
      }
      return { success: false, error: 'Failed to send reset email' };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.SOMETHING_WENT_WRONG;
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Reset password handler
  const resetPassword = useCallback(
    async (token: string, password: string, confirmPassword: string) => {
      try {
        const response = await authService.resetPassword({
          token,
          password,
          confirmPassword,
        });
        if (response.success) {
          toast.success(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
          router.push(ROUTES.LOGIN);
          return { success: true };
        }
        return { success: false, error: 'Failed to reset password' };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SOMETHING_WENT_WRONG;
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [router],
  );

  // Get user role
  const role = useMemo(() => user?.role as TenantRole | undefined, [user]);

  // Check if user is owner
  const isOwner = useMemo(() => role === 'OWNER', [role]);

  // Check if user is admin or owner
  const isAdminOrOwner = useMemo(
    () => role === 'OWNER' || role === 'ADMIN',
    [role],
  );

  return {
    // State
    user,
    tenant,
    isAuthenticated,
    isLoading,
    isInitialized,
    permissions,
    role,
    isOwner,
    isAdminOrOwner,

    // Auth actions
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,

    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
