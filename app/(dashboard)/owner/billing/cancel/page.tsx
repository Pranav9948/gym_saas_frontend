'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common';
import { ROUTES } from '@/config';
import { billingTrace, resetBillingTrace } from '@/lib/billing/trace';

export default function BillingCancelPage() {
  React.useEffect(() => {
    resetBillingTrace('cancel');
    billingTrace('Stripe redirected to cancel page', {
      note: 'No API calls — subscription unchanged in DB',
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Checkout canceled"
        description="No changes were made to your subscription."
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <XCircle className="size-12 text-muted-foreground" aria-hidden />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              Upgrade not completed
            </p>
            <p className="text-sm text-muted-foreground">
              You can return to billing anytime to choose a plan.
            </p>
          </div>

          <Button asChild className="mt-2">
            <Link href={ROUTES.OWNER_BILLING}>Back to Billing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
