'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useToast } from '@/hooks'
import { LoadingSpinner } from '@/components/common'
import { ROUTES, getPostLoginRoute } from '@/config'
import { OwnerDashboardLayout } from '@/components/owner/OwnerDashboardLayout'
import { applyAppTheme } from '@/components/theme-sync'

interface OwnerLayoutProps {
  children: React.ReactNode
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const { user, isLoading, isInitialized } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    applyAppTheme('light')
  }, [])

  useEffect(() => {
    if (!isLoading && isInitialized && user && user.role !== 'OWNER') {
      toast({
        title: 'Access Denied',
        description: 'Only gym owners can access this area.',
        variant: 'destructive',
      })
      router.push(getPostLoginRoute(user.role))
    }
  }, [isLoading, isInitialized, user, router, toast])

  useEffect(() => {
    if (!isLoading && isInitialized && !user) {
      toast({
        title: 'Access Denied',
        description: 'Please log in to access this page.',
        variant: 'destructive',
      })
      router.push(ROUTES.LOGIN)
    }
  }, [isLoading, isInitialized, user, router, toast])

  if (isLoading || !isInitialized || !user || user.role !== 'OWNER') {
    return <LoadingSpinner fullScreen />
  }

  return <OwnerDashboardLayout>{children}</OwnerDashboardLayout>
}
