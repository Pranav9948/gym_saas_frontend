'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { StaffPortalGuard } from '@/components/guards';
import { StaffDashboardLayout } from '@/components/staff/StaffDashboardLayout';
import {
  isMemberPortalRoute,
  isOwnerPortalRoute,
  isSuperAdminRoute,
} from '@/config';

interface StaffPortalLayoutShellProps {
  children: React.ReactNode;
}

export function StaffPortalLayoutShell({
  children,
}: StaffPortalLayoutShellProps) {
  const pathname = usePathname();

  if (
    isOwnerPortalRoute(pathname) ||
    isSuperAdminRoute(pathname) ||
    isMemberPortalRoute(pathname)
  ) {
    return <>{children}</>;
  }

  return (
    <StaffPortalGuard>
      <StaffDashboardLayout>{children}</StaffDashboardLayout>
    </StaffPortalGuard>
  );
}
