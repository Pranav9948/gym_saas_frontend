'use client'

import { ResetCodesInbox } from '@/components/auth/ResetCodesInbox'
import { authService, queryKeys } from '@/services'

export default function OwnerResetCodesPage() {
  return (
    <ResetCodesInbox
      title="Reset codes"
      description="6-digit codes for staff who forgot their password. If this gym has no staff accounts, trainer and member codes also appear here."
      queryKey={queryKeys.auth.resetCodes()}
      queryFn={() => authService.listResetCodes()}
    />
  )
}
