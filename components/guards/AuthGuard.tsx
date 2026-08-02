'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/config';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  redirectTo = ROUTES.LOGIN,
}: AuthGuardProps) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isInitialized && !user) {
      router.replace(redirectTo);
    }
  }, [isLoading, isInitialized, user, router, redirectTo]);

  if (isLoading || !isInitialized) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}
