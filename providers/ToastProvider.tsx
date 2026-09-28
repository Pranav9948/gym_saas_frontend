'use client';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import type { ReactNode } from 'react';

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SonnerToaster position="top-right" closeButton />
    </>
  );
}
