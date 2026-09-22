'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common'

export default function StaffProfileRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/settings')
  }, [router])

  return <LoadingSpinner label="Opening account settings…" />
}
