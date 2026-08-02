'use client';

import { billingService } from '@/services/billing.service';
import { queryKeys } from '@/services/queryKeys';
import { useFetch } from '@/hooks/useFetch';
import type { PaymentHistoryParams } from '@/types/billing';

export function usePaymentHistory(params: PaymentHistoryParams = { limit: 10 }) {
  return useFetch(
    queryKeys.billing.paymentHistory(params),
    () => billingService.getPaymentHistory(params),
    {
      staleTime: 30_000,
    },
  );
}
