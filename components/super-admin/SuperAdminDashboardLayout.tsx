'use client'

import React from 'react'
import { SuperAdminSidebar } from './SuperAdminSidebar'
import { SuperAdminNavbar } from './SuperAdminNavbar'

interface SuperAdminDashboardLayoutProps {
  children: React.ReactNode
}

export function SuperAdminDashboardLayout({ children }: SuperAdminDashboardLayoutProps) {
  return (
    <div className="dark flex h-dvh overflow-hidden bg-background text-foreground">
      <SuperAdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <SuperAdminNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
