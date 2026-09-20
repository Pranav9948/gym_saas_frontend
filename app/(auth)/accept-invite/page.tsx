import React from 'react'
import { AcceptInviteForm } from '@/components/features/auth/AcceptInviteForm'
import { LoadingSpinner } from '@/components/common'

export const metadata = {
  title: 'Accept Invite - GymFlow',
  description: 'Accept your team invitation and set up your account',
}

export default function AcceptInvitePage() {
  return (
    <div className="py-8">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-foreground">Join your gym team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set a password to accept your invitation.
        </p>
      </div>
      <React.Suspense fallback={<LoadingSpinner label="Loading invite…" />}>
        <AcceptInviteForm />
      </React.Suspense>
    </div>
  )
}
