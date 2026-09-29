'use client'

import React from 'react'
import { OwnerSidebar } from './OwnerSidebar'
import { OwnerNavbar } from './OwnerNavbar'
import { FeatureLimitDialog } from '@/components/owner/billing'

interface OwnerDashboardLayoutProps {
  children: React.ReactNode
}

export function OwnerDashboardLayout({ children }: OwnerDashboardLayoutProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <OwnerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <OwnerNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
      <FeatureLimitDialog />
    </div>
  )
}
