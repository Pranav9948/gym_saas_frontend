'use client';

// ===========================================
// Toast Provider - Sonner toast wrapper
// ===========================================

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={theme as 'light' | 'dark' | 'system'}
        position="top-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            borderRadius: '0.5rem',
          },
        }}
      />
    </>
  );
}

// Re-export toast for convenience
export { toast } from 'sonner';
