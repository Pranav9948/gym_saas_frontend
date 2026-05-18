// ===========================================
// Auth Store - Zustand store for authentication
// ===========================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Tenant, TenantRole } from '@/types';
import { getPermissionsForRole } from '@/config/permissions';
import { setAccessToken, clearAccessToken } from '@/lib/api/client';

interface AuthState {
  // State
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  permissions: string[];

  // Actions
  setAuth: (user: User, tenant: Tenant | null, accessToken: string) => void;
  setUser: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
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
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  permissions: [],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (user, tenant, accessToken) => {
        // Store token in memory (not persisted)
        setAccessToken(accessToken);

        // Get permissions from role
        const role = user.role as TenantRole;
        const permissions = getPermissionsForRole(role);

        set({
          user,
          tenant,
          isAuthenticated: true,
          isLoading: false,
          permissions,
        });
      },

      setUser: (user) => {
        const role = user.role as TenantRole;
        const permissions = getPermissionsForRole(role);

        set({
          user,
          permissions,
        });
      },

      setTenant: (tenant) => {
        set({ tenant });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setInitialized: (isInitialized) => {
        set({ isInitialized });
      },

      logout: () => {
        clearAccessToken();
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
      // Only persist user and tenant, not tokens or loading state
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    },
  ),
);

// Selectors for common use cases
export const selectUser = (state: AuthState) => state.user;
export const selectTenant = (state: AuthState) => state.tenant;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectPermissions = (state: AuthState) => state.permissions;
export const selectRole = (state: AuthState) =>
  state.user?.role as TenantRole | undefined;
