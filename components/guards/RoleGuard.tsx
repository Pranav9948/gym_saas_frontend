'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { getForbiddenRedirect } from '@/config';
import type { TenantRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: (TenantRole | string)[];
  fallbackRoute?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackRoute,
}: RoleGuardProps) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  const hasAccess =
    !!user?.role && allowedRoles.includes(user.role as TenantRole);

  useEffect(() => {
    if (!isLoading && isInitialized && user && !hasAccess) {
      router.replace(fallbackRoute ?? getForbiddenRedirect(user.role));
    }
  }, [isLoading, isInitialized, user, hasAccess, router, fallbackRoute]);

  if (isLoading || !isInitialized || !user) {
    return <LoadingSpinner fullScreen />;
  }

  if (!hasAccess) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}
