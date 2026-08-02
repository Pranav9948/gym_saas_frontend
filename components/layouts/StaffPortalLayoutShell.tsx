'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/common';
import { StaffPortalGuard } from '@/components/guards';
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
      <DashboardLayout>{children}</DashboardLayout>
    </StaffPortalGuard>
  );
}
