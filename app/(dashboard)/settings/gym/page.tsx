'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common'

export default function StaffGymRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/settings?tab=gym')
  }, [router])

  return <LoadingSpinner label="Opening gym settings…" />
}
