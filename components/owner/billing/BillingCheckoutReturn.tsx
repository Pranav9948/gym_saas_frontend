'use client';

import React, { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { refetchBillingQueries } from '@/lib/billing/query-utils';

function BillingCheckoutReturnInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const success = searchParams.get('success') === 'true';
    const canceled =
      searchParams.get('canceled') === 'true' ||
      searchParams.get('cancelled') === 'true';
    const sessionId = searchParams.get('session_id');

    if (!success && !canceled) {
      return;
    }

    if (success) {
      toast.success('Plan upgraded successfully!', {
        description: sessionId
          ? 'Stripe confirmed your checkout session. Your plan will refresh in a moment.'
          : 'Your subscription is now up to date.',
      });
      void refetchBillingQueries(queryClient);
    } else {
      toast.message('Checkout canceled', {
        description: 'No changes were made to your subscription.',
      });
    }

    router.replace(pathname, { scroll: false });
  }, [searchParams, router, pathname, queryClient]);

  return null;
}

export function BillingCheckoutReturn() {
  return (
    <Suspense fallback={null}>
      <BillingCheckoutReturnInner />
    </Suspense>
  );
}
