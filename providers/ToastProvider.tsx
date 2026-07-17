'use client';

import { Toaster as RadixToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import type { ReactNode } from 'react';

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <RadixToaster />
      <SonnerToaster position="top-right" closeButton={true} />
    </>
  );
}
