'use client';

import { billingService } from '@/services/billing.service';
import { queryKeys } from '@/services/queryKeys';
import { useFetch } from '@/hooks/useFetch';

export function useBillingUsage() {
  return useFetch(queryKeys.billing.usage(), () => billingService.getUsage(), {
    staleTime: 30_000,
  });
}
