'use client';

import React from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminNavbar } from './SuperAdminNavbar';

interface SuperAdminDashboardLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminDashboardLayout({
  children,
}: SuperAdminDashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
