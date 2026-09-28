// ===========================================
// UI Store - Zustand store for UI state
// ===========================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Theme
  theme: Theme;

  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;

  // Modal states
  confirmDialogOpen: boolean;
  confirmDialogConfig: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: Theme) => void;
  setGlobalLoading: (loading: boolean, message?: string | null) => void;
  showConfirmDialog: (
    config: NonNullable<UIState['confirmDialogConfig']>,
  ) => void;
  hideConfirmDialog: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'system',
      globalLoading: false,
      loadingMessage: null,
      confirmDialogOpen: false,
      confirmDialogConfig: null,

      // Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (sidebarOpen) => {
        set({ sidebarOpen });
      },

      toggleSidebarCollapsed: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (sidebarCollapsed) => {
        set({ sidebarCollapsed });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setGlobalLoading: (globalLoading, loadingMessage = null) => {
        set({ globalLoading, loadingMessage });
      },

      showConfirmDialog: (config) => {
        set({
          confirmDialogOpen: true,
          confirmDialogConfig: config,
        });
      },

      hideConfirmDialog: () => {
        set({
          confirmDialogOpen: false,
          confirmDialogConfig: null,
        });
      },
    }),
    {
      name: 'gym-ui-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist theme and sidebar preferences
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

// Selectors
export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIState) =>
  state.sidebarCollapsed;
export const selectTheme = (state: UIState) => state.theme;
export const selectGlobalLoading = (state: UIState) => state.globalLoading;
export const selectLoadingMessage = (state: UIState) => state.loadingMessage;
