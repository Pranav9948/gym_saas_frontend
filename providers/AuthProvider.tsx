'use client';

// ===========================================
// Auth Provider - Session management
// ===========================================

import { useEffect, useCallback, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { setAccessToken, clearAccessToken } from '@/lib/api/client';
import { isPublicRoute, ROUTES } from '@/config/routes';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setAuth, setLoading, setInitialized, logout, isAuthenticated, isInitialized } =
    useAuthStore();

  // Initialize auth state on mount
  const initializeAuth = useCallback(async () => {
    setLoading(true);

    try {
      // Try to refresh token (uses httpOnly cookie)
      const refreshResponse = await authService.refreshTokens();

      if (refreshResponse.success && refreshResponse.data?.accessToken) {
        // Set access token in memory
        setAccessToken(refreshResponse.data.accessToken);

        // Get current user info
        const meResponse = await authService.getMe();

        if (meResponse.success && meResponse.data) {
          // For now, set user without full tenant data
          // Tenant data should be fetched separately if needed
          setAuth(
            {
              id: meResponse.data.id,
              email: meResponse.data.email,
              firstName: meResponse.data.firstName,
              lastName: meResponse.data.lastName,
              role: meResponse.data.role,
            },
            null, // Tenant will be fetched when needed
            refreshResponse.data.accessToken
          );
        } else {
          // Failed to get user, clear auth
          logout();
        }
      } else {
        // No valid session, clear auth
        logout();
      }
    } catch {
      // Error refreshing token, user needs to log in
      clearAccessToken();
      logout();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [setAuth, setLoading, setInitialized, logout]);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle logout events from API interceptor
  useEffect(() => {
    const handleLogout = () => {
      logout();
      toast.error('Your session has expired. Please log in again.');
      router.push(ROUTES.LOGIN);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [logout, router]);

  // Redirect logic
  useEffect(() => {
    if (!isInitialized) return;

    const isPublic = isPublicRoute(pathname);

    if (!isAuthenticated && !isPublic) {
      // Redirect to login if not authenticated and trying to access protected route
      router.push(ROUTES.LOGIN);
    } else if (isAuthenticated && isPublic && pathname !== ROUTES.ACCEPT_INVITE) {
      // Redirect to dashboard if authenticated and on login/register page
      // Exception: accept-invite page needs auth but is publicly accessible
      if (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER) {
        router.push(ROUTES.DASHBOARD);
      }
    }
  }, [isAuthenticated, isInitialized, pathname, router]);

  return <>{children}</>;
}
