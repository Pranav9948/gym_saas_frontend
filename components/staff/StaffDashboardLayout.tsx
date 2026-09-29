'use client'

import React from 'react'
import { StaffNavbar } from '@/components/staff/StaffNavbar'
import { StaffSidebar } from '@/components/staff/StaffSidebar'

interface StaffDashboardLayoutProps {
  children: React.ReactNode
}

export function StaffDashboardLayout({ children }: StaffDashboardLayoutProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <StaffSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <StaffNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
