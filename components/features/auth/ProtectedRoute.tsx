'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { ROUTES, getForbiddenRedirect } from '@/config';
import type { TenantRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: (TenantRole | string)[];
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
  fallbackRoute?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermissions,
  requireAllPermissions = true,
  fallbackRoute,
}: ProtectedRouteProps) {
  const {
    user,
    isLoading,
    isInitialized,
    hasAllPermissions,
    hasAnyPermission,
  } = useAuth();
  const router = useRouter();

  const hasRoleAccess = requiredRoles?.length
    ? !!user?.role && requiredRoles.includes(user.role)
    : true;

  const hasPermissionAccess = requiredPermissions?.length
    ? requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions)
    : true;

  const hasAccess = hasRoleAccess && hasPermissionAccess;

  useEffect(() => {
    if (isLoading || !isInitialized) return;

    if (!user) {
      router.replace(ROUTES.UNAUTHORIZED);
      return;
    }

    if (!hasAccess) {
      router.replace(fallbackRoute ?? getForbiddenRedirect(user.role));
    }
  }, [isLoading, isInitialized, user, hasAccess, router, fallbackRoute]);

  if (isLoading || !isInitialized) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user || !hasAccess) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}
