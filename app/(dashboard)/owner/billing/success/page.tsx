'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner, PageHeader } from '@/components/common';
import { ROUTES } from '@/config';
import { refetchBillingQueries } from '@/lib/billing/query-utils';
import { billingTrace, resetBillingTrace } from '@/lib/billing/trace';

const POLL_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 2000;

function BillingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = React.useState(true);

  React.useEffect(() => {
    resetBillingTrace('success');
    billingTrace('Stripe redirected to success page', {
      note: sessionId ? `session_id=${sessionId}` : 'no session_id in URL',
    });

    let attempts = 0;
    let cancelled = false;

    async function syncBillingState() {
      attempts += 1;
      await refetchBillingQueries(queryClient, attempts);

      if (attempts >= POLL_ATTEMPTS) {
        billingTrace('Success page polling complete', {
          note: `${POLL_ATTEMPTS} refetch rounds finished — UI should show updated plan`,
        });
        if (!cancelled) setSyncing(false);
        return;
      }

      billingTrace(`Waiting ${POLL_INTERVAL_MS}ms before next poll`, {
        note: `attempt ${attempts}/${POLL_ATTEMPTS}`,
      });

      window.setTimeout(() => {
        if (!cancelled) void syncBillingState();
      }, POLL_INTERVAL_MS);
    }

    void syncBillingState();

    return () => {
      cancelled = true;
    };
  }, [queryClient, sessionId]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Payment successful"
        description="Your subscription is being updated. This usually takes a few seconds."
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <CheckCircle2 className="size-12 text-success" aria-hidden />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              Thank you for upgrading
            </p>
            <p className="text-sm text-muted-foreground">
              {sessionId
                ? 'Stripe confirmed your checkout session.'
                : 'Your payment was processed successfully.'}
            </p>
            {syncing ? (
              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Refreshing your plan and usage limits…
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your billing details are now up to date.
              </p>
            )}
          </div>

          <Button asChild className="mt-2">
            <Link href={ROUTES.OWNER_BILLING}>Back to Billing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <BillingSuccessContent />
    </Suspense>
  );
}
