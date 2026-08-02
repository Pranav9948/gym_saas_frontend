'use client';

import { billingService } from '@/services/billing.service';
import { queryKeys } from '@/services/queryKeys';
import { useFetch } from '@/hooks/useFetch';

export function useBillingSummary() {
  return useFetch(queryKeys.billing.summary(), () => billingService.getSummary(), {
    staleTime: 30_000,
  });
}
