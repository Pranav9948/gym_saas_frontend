'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common'
import { ROUTES } from '@/config'

export default function MemberIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(ROUTES.MEMBER_PORTAL)
  }, [router])

  return <LoadingSpinner label="Opening your training…" />
}
