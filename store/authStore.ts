// ===========================================
// Auth Store - Zustand store for authentication
// ===========================================

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import type { User, Tenant, TenantRole } from '@/types';
import { getPermissionsForRole } from '@/config/permissions';
import {
  setAccessToken,
  clearAccessToken,
  setAuthType,
  bumpAuthSessionEpoch,
  type AuthType,
} from '@/lib/api/client';

interface AuthState {
  // State
  user: User | null;
  tenant: Tenant | null;
  authType: AuthType;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  permissions: string[];

  // Actions
  setAuth: (user: User, tenant: Tenant | null, accessToken: string) => void;
  setUser: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
  setPermissions: (permissions: string[]) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
  reset: () => void;

  // Helpers
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const initialState = {
  user: null,
  tenant: null,
  authType: 'user' as AuthType,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  permissions: [],
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setAuth: (user, tenant, accessToken) => {
          bumpAuthSessionEpoch();
          const isSuperAdmin = user.role === 'SUPER_ADMIN';
          const sessionAuthType: AuthType = isSuperAdmin ? 'superAdmin' : 'user';
          setAuthType(sessionAuthType);
          setAccessToken(accessToken);

          const role = user.role as TenantRole;
          const permissions = isSuperAdmin
            ? []
            : getPermissionsForRole(role);

          set({
            user,
            tenant,
            authType: sessionAuthType,
            permissions,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
          });
        },

        setUser: (user) => {
          const role = user.role as TenantRole;
          const permissions = getPermissionsForRole(role);

          set((state) => ({
            ...state,
            user,
            permissions,
          }));
        },

        setTenant: (tenant) => {
          set({ tenant });
        },

        setPermissions: (permissions) => {
          set({ permissions });
        },

        setLoading: (isLoading) => {
          set({ isLoading });
        },

        setInitialized: (isInitialized) => {
          set({ isInitialized });
        },

        logout: () => {
          clearAccessToken();
          setAuthType('user');
          set({
            ...initialState,
            isLoading: false,
            isInitialized: true,
          });
        },

        reset: () => {
          clearAccessToken();
          set(initialState);
        },

        hasPermission: (permission) => {
          return get().permissions.includes(permission);
        },

        hasAnyPermission: (permissions) => {
          const userPermissions = get().permissions;
          return permissions.some((p) => userPermissions.includes(p));
        },

        hasAllPermissions: (permissions) => {
          const userPermissions = get().permissions;
          return permissions.every((p) => userPermissions.includes(p));
        },
      }),
      {
        name: 'gym-auth-storage',
        storage: createJSONStorage(() => localStorage),

        partialize: (state) => ({
          user: state.user,
          tenant: state.tenant,
          authType: state.authType,
          isAuthenticated: state.isAuthenticated,
          permissions: state.permissions,
          isInitialized: true,
        }),

        onRehydrateStorage: () => (state) => {
          if (state?.user) {
            setAuthType(state.authType ?? 'user');
          }
        },
      },
    ),
    { name: 'AuthStore' },
  ),
);

export function getPersistedAuthSession(): {
  authType: AuthType;
  user: User | null;
  isAuthenticated: boolean;
} {
  if (typeof window === 'undefined') {
    return { authType: 'user', user: null, isAuthenticated: false };
  }

  try {
    const raw = localStorage.getItem('gym-auth-storage');
    if (!raw) {
      return { authType: 'user', user: null, isAuthenticated: false };
    }

    const parsed = JSON.parse(raw) as {
      state?: {
        authType?: AuthType;
        user?: User | null;
        isAuthenticated?: boolean;
      };
    };
    const state = parsed.state;
    const persistedUser = state?.user ?? null;
    const persistedAuthType: AuthType =
      state?.authType === 'superAdmin' ||
      persistedUser?.role === 'SUPER_ADMIN'
        ? 'superAdmin'
        : 'user';

    return {
      authType: persistedAuthType,
      user: persistedUser,
      isAuthenticated: Boolean(state?.isAuthenticated && persistedUser),
    };
  } catch {
    return { authType: 'user', user: null, isAuthenticated: false };
  }
}

// Selectors for common use cases
export const selectUser = (state: AuthState) => state.user;
export const selectTenant = (state: AuthState) => state.tenant;
export const selectAuthType = (state: AuthState) => state.authType;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectPermissions = (state: AuthState) => state.permissions;
export const selectRole = (state: AuthState) =>
  state.user?.role as TenantRole | undefined;
