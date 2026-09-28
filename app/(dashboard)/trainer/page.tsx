'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/common'
import { ROUTES } from '@/config'

export default function TrainerIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(ROUTES.TRAINER_MEMBERS)
  }, [router])

  return <LoadingSpinner label="Opening your members…" />
}
