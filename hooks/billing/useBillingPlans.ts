'use client';

import { billingService } from '@/services/billing.service';
import { queryKeys } from '@/services/queryKeys';
import { useFetch } from '@/hooks/useFetch';

export function useBillingPlans() {
  return useFetch(queryKeys.billing.plans(), () => billingService.getPlans(), {
    staleTime: 60_000,
  });
}
