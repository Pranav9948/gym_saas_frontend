'use client';

import React from 'react';
import { ErrorBoundary, GlobalErrorUI } from '@/components/common';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <GlobalErrorUI
          title="Something went wrong"
          description={error.message}
          actions={
            <Button onClick={() => window.location.reload()}>Reload page</Button>
          }
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
