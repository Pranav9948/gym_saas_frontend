'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common'
import { TrainerNavbar } from '@/components/trainer/TrainerNavbar'
import { TrainerSidebar } from '@/components/trainer/TrainerSidebar'
import { ROUTES, getPostLoginRoute } from '@/config'
import { useAuth } from '@/hooks'

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const { user, tenant, isLoading, isInitialized } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (isLoading || !isInitialized) return
    if (!user) {
      router.replace(ROUTES.LOGIN)
      return
    }
    if (user.role !== 'TRAINER') {
      router.replace(getPostLoginRoute(user.role))
    }
  }, [isLoading, isInitialized, user, router])

  if (isLoading || !isInitialized || !user || user.role !== 'TRAINER') {
    return <LoadingSpinner fullScreen />
  }

  if (tenant?.trainerPortalEnabled === false) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-xl border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Trainer portal is off</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The gym owner has turned off the trainer workspace. Ask them to enable
            it from the menu.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <TrainerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TrainerNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl p-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
