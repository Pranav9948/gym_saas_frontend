'use client';

import React from 'react';
import { StaffPortalLayoutShell } from '@/components/layouts/StaffPortalLayoutShell';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffPortalLayoutShell>{children}</StaffPortalLayoutShell>;
}
