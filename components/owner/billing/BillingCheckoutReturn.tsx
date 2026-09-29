'use client';

import React, { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { billingService } from '@/services/billing.service';
import { queryKeys } from '@/services/queryKeys';
import {
  hasPaidBillingPlan,
  refetchBillingQueries,
} from '@/lib/billing/query-utils';
import { billingTrace } from '@/lib/billing/trace';

const POLL_ATTEMPTS = 8;
const POLL_DELAY_MS = 1200;

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

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

    let ignore = false;

    const finish = () => {
      if (!ignore) {
        router.replace(pathname, { scroll: false });
      }
    };

    if (!success) {
      toast.message('Checkout canceled', {
        description: 'No changes were made to your subscription.',
      });
      finish();
      return;
    }

    void (async () => {
      billingTrace('SUCCESS FLOW START', {
        note: sessionId
          ? 'Syncing Stripe checkout session before refreshing billing'
          : 'Refreshing billing after paid upgrade',
      });

      if (sessionId) {
        try {
          const synced = await billingService.syncCheckoutSession(sessionId);
          queryClient.setQueryData(queryKeys.billing.summary(), synced);
          billingTrace('Checkout session synced', {
            planName: synced.data.plan.name,
            isPaid: synced.data.isPaid,
          });
        } catch (error) {
          billingTrace('Checkout session sync failed — will poll', { error });
        }
      } else {
        try {
          const reconciled = await billingService.reconcileSubscription();
          queryClient.setQueryData(queryKeys.billing.summary(), reconciled);
        } catch {
          // Polling still runs below.
        }
      }

      let paid = false;

      for (let attempt = 1; attempt <= POLL_ATTEMPTS && !ignore; attempt += 1) {
        await refetchBillingQueries(queryClient, attempt);
        paid = hasPaidBillingPlan(queryClient);
        if (paid) {
          break;
        }
        if (attempt < POLL_ATTEMPTS) {
          await wait(POLL_DELAY_MS);
        }
      }

      if (ignore) {
        return;
      }

      if (paid) {
        toast.success('Plan upgraded successfully!', {
          description: 'Your subscription is now up to date.',
        });
      } else {
        toast.message('Payment received', {
          description:
            'Your plan is still updating. Refresh this page in a moment if it still shows Free.',
        });
      }

      finish();
    })();

    return () => {
      ignore = true;
    };
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
