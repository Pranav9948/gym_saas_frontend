'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/config';

export default function BillingCancelPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace(`${ROUTES.OWNER_BILLING}?canceled=true`);
  }, [router]);

  return <LoadingSpinner fullScreen />;
}
