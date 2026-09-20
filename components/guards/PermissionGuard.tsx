'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { canAccessRoute, ROUTES } from '@/config';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  requireAll?: boolean;
  fallbackRoute?: string;
}

export function PermissionGuard({
  children,
  permissions,
  requireAll = true,
  fallbackRoute = ROUTES.FORBIDDEN,
}: PermissionGuardProps) {
  const { user, permissions: userPermissions, isLoading, isInitialized, hasAllPermissions, hasAnyPermission } =
    useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const explicitAccess = permissions
    ? requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    : true;

  const routeAccess = canAccessRoute(pathname, userPermissions, user?.role);

  const hasAccess = explicitAccess && routeAccess;

  useEffect(() => {
    if (!isLoading && isInitialized && user && !hasAccess) {
      router.replace(fallbackRoute);
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
