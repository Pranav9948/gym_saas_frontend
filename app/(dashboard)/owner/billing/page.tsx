'use client';

import React from 'react';
import { PageHeader } from '@/components/common';
import {
  CurrentPlanCard,
  FeatureUsageSection,
  ManageBillingButton,
  PaymentHistorySection,
  PlanComparisonGrid,
} from '@/components/owner/billing';
import { resetBillingTrace, billingTrace } from '@/lib/billing/trace';

export default function OwnerBillingPage() {
  React.useEffect(() => {
    resetBillingTrace('billing_page_load');
    billingTrace('Owner billing page mounted', {
      note: 'Child components will fire GET summary/plans/usage/payment-history',
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Manage your GymFlow subscription, usage and plan."
        actions={<ManageBillingButton />}
      />

      <CurrentPlanCard />

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Usage &amp; limits</h2>
          <p className="text-sm text-muted-foreground">
            Track capacity across members, trainers, and staff.
          </p>
        </div>
        <FeatureUsageSection />
      </section>

      <PlanComparisonGrid />

      <PaymentHistorySection />
    </div>
  );
}
