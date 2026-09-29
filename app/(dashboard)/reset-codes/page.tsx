'use client'

import { ResetCodesInbox } from '@/components/auth/ResetCodesInbox'
import { authService, queryKeys } from '@/services'

export default function StaffResetCodesPage() {
  return (
    <ResetCodesInbox
      title="Reset codes"
      description="6-digit codes for trainers and members who forgot their password. Share the code so they can set a new password."
      queryKey={queryKeys.auth.resetCodes()}
      queryFn={() => authService.listResetCodes()}
    />
  )
}
