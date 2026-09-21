'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/config';

function BillingSuccessRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const params = new URLSearchParams({ success: 'true' });
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      params.set('session_id', sessionId);
    }
    router.replace(`${ROUTES.OWNER_BILLING}?${params.toString()}`);
  }, [router, searchParams]);

  return <LoadingSpinner fullScreen />;
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <BillingSuccessRedirect />
    </Suspense>
  );
}
