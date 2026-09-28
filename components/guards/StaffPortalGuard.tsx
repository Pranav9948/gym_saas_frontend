'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import {
  canAccessRoute,
  getPostLoginRoute,
  ROUTES,
  STAFF_PORTAL_ROLES,
} from '@/config';

interface StaffPortalGuardProps {
  children: React.ReactNode;
}

export function StaffPortalGuard({ children }: StaffPortalGuardProps) {
  const { user, tenant, permissions, isLoading, isInitialized } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isStaffRole =
    !!user?.role && STAFF_PORTAL_ROLES.includes(user.role as (typeof STAFF_PORTAL_ROLES)[number]);

  const hasRouteAccess = canAccessRoute(pathname, permissions, user?.role);

  useEffect(() => {
    if (isLoading || !isInitialized) return;

    if (!user) {
      router.replace(ROUTES.UNAUTHORIZED);
      return;
    }

    if (!isStaffRole) {
      router.replace(getPostLoginRoute(user.role));
      return;
    }

    if (tenant?.staffPortalEnabled === false) {
      router.replace(ROUTES.FORBIDDEN);
      return;
    }

    if (!hasRouteAccess) {
      router.replace(ROUTES.FORBIDDEN);
    }
  }, [isLoading, isInitialized, user, tenant, isStaffRole, hasRouteAccess, router]);

  if (isLoading || !isInitialized) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user || !isStaffRole || !hasRouteAccess) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}
