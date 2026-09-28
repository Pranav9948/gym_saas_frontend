// ===========================================
// Auth Provider - Session management
// ===========================================

'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getPersistedAuthSession } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import {
  setAccessToken,
  refreshAccessToken,
  setAuthType,
  getAuthSessionEpoch,
} from '@/lib/api/client';
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
  const epochAtStart = getAuthSessionEpoch();
  const sessionWasReplaced = () => getAuthSessionEpoch() !== epochAtStart;

  setAuthType(sessionAuthType);

  try {
    const accessToken = await refreshAccessToken();

    if (sessionWasReplaced()) {
      return;
    }

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

    if (sessionWasReplaced()) {
      return;
    }

    if (meResponse.success && meResponse.data) {
      const tenant = meResponse.data.tenant ?? persisted.tenant ?? null;

      if (sessionWasReplaced()) {
        return;
      }

      setAuth(
        {
          id: meResponse.data.id,
          email: meResponse.data.email,
          firstName: meResponse.data.firstName,
          lastName: meResponse.data.lastName,
          role: meResponse.data.role,
          avatarUrl: meResponse.data.avatarUrl,
        },
        tenant,
        accessToken,
      );
    } else {
      logout();
    }
  } catch {
    if (!sessionWasReplaced()) {
      logout();
    }
  } finally {
    if (!sessionWasReplaced()) {
      setLoading(false);
      setInitialized(true);
    }
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
