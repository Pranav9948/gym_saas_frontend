'use client'

import { ResetCodesInbox } from '@/components/auth/ResetCodesInbox'
import { queryKeys } from '@/services'
import { superAdminAuthService } from '@/services/super-admin'

export default function SuperAdminResetCodesPage() {
  return (
    <ResetCodesInbox
      title="Reset codes"
      description="6-digit codes for gym owners who forgot their password. Share the code with the owner so they can set a new password."
      queryKey={queryKeys.superAdmin.resetCodes()}
      queryFn={() => superAdminAuthService.listResetCodes()}
    />
  )
}
