'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common'

export default function StaffNotificationsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/settings?tab=notifications')
  }, [router])

  return <LoadingSpinner label="Opening notification settings…" />
}
