// ===========================================
// Auth Provider - Session management
// ===========================================

'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getPersistedAuthSession } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { tenantService } from '@/services/tenant.service';
import { setAccessToken, clearAccessToken, refreshAccessToken, setAuthType } from '@/lib/api/client';
import { ROUTES } from '@/config/routes';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

// Survives React Strict Mode remounts so init only runs once per page load
let authInitStarted = false;

async function initializeAuthSession(): Promise<void> {
  const {
    setAuth,
    setLoading,
    setInitialized,
    logout,
  } = useAuthStore.getState();

  setLoading(true);

  const persisted = getPersistedAuthSession();

  if (!persisted.isAuthenticated || !persisted.user) {
    setLoading(false);
    setInitialized(true);
    return;
  }

  const sessionAuthType = persisted.authType;
  const sessionUser = persisted.user;

  setAuthType(sessionAuthType);

  try {
    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      logout();
      return;
    }

    setAccessToken(accessToken);

    if (sessionAuthType === 'superAdmin') {
      setAuth(sessionUser, null, accessToken);
      return;
    }

    const meResponse = await authService.getMe();

    if (meResponse.success && meResponse.data) {
      let tenant = null;

      if (meResponse.data.role === 'OWNER') {
        try {
          const tenantResponse = await tenantService.getTenant();
          tenant = tenantResponse.data ?? null;
        } catch {
          tenant = null;
        }
      }

      setAuth(
        {
          id: meResponse.data.id,
          email: meResponse.data.email,
          firstName: meResponse.data.firstName,
          lastName: meResponse.data.lastName,
          role: meResponse.data.role,
        },
        tenant,
        accessToken,
      );
    } else {
      logout();
    }
  } catch {
    clearAccessToken();
    logout();
  } finally {
    setLoading(false);
    setInitialized(true);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (authInitStarted) {
      return;
    }
    authInitStarted = true;
    void initializeAuthSession();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      logout();
      toast.error('Your session has expired. Please log in again.');
      router.push(ROUTES.LOGIN);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [logout, router]);

  return <>{children}</>;
}
