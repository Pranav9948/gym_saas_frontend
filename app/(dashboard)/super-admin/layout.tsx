'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useToast } from '@/hooks'
import { LoadingSpinner } from '@/components/common'
import { ROUTES } from '@/config'
import { SuperAdminDashboardLayout } from '@/components/super-admin/SuperAdminDashboardLayout'

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { user, isLoading, isInitialized } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (!user) {
        toast({
          title: 'Access Denied',
          description: 'Please log in to access this page.',
          variant: 'destructive',
        })
        router.push(ROUTES.LOGIN)
      } else if (user.role !== 'SUPER_ADMIN') {
        toast({
          title: 'Access Denied',
          description: 'Only Super Admins can access this page.',
          variant: 'destructive',
        })
        router.push(ROUTES.LOGIN)
      }
    }
  }, [isLoading, isInitialized, user, router, toast])

  if (isLoading || !isInitialized || !user || user.role !== 'SUPER_ADMIN') {
    return <LoadingSpinner fullScreen />
  }

  return <SuperAdminDashboardLayout>{children}</SuperAdminDashboardLayout>
}
