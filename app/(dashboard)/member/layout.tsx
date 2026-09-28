'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common'
import { MemberNavbar } from '@/components/member/MemberNavbar'
import { MemberSidebar } from '@/components/member/MemberSidebar'
import { ROUTES, getPostLoginRoute } from '@/config'
import { useAuth } from '@/hooks'
import { applyAppTheme } from '@/components/theme-sync'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { user, tenant, isLoading, isInitialized } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    applyAppTheme('dark')
  }, [])

  React.useEffect(() => {
    if (isLoading || !isInitialized) return
    if (!user) {
      router.replace(ROUTES.LOGIN)
      return
    }
    if (user.role !== 'MEMBER' && user.role !== 'CLIENT') {
      router.replace(getPostLoginRoute(user.role))
    }
  }, [isLoading, isInitialized, user, router])

  if (
    isLoading ||
    !isInitialized ||
    !user ||
    (user.role !== 'MEMBER' && user.role !== 'CLIENT')
  ) {
    return <LoadingSpinner fullScreen />
  }

  if (tenant?.memberPortalEnabled === false) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-xl border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Member portal is off</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The gym owner has turned off member self-service. Ask the front desk
            for help.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <MemberSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MemberNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl p-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
