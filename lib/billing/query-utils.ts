import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { billingTrace } from '@/lib/billing/trace';

export function invalidateBillingQueries(queryClient: QueryClient): Promise<void> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.billing.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.tenant.current() }),
  ]).then(() => undefined);
}

export async function refetchBillingQueries(
  queryClient: QueryClient,
  pollAttempt?: number,
): Promise<void> {
  const label =
    pollAttempt !== undefined
      ? `Success page poll #${pollAttempt} — refetch billing queries`
      : 'Refetch billing queries';

  billingTrace(label, {
    note: 'summary, plans, usage, subscription, payment-history, tenant',
  });

  await Promise.all([
    queryClient.refetchQueries({ queryKey: queryKeys.billing.summary() }),
    queryClient.refetchQueries({ queryKey: queryKeys.billing.plans() }),
    queryClient.refetchQueries({ queryKey: queryKeys.billing.usage() }),
    queryClient.refetchQueries({ queryKey: queryKeys.billing.subscription() }),
    queryClient.refetchQueries({ queryKey: queryKeys.billing.paymentHistory() }),
    queryClient.refetchQueries({ queryKey: queryKeys.tenant.current() }),
  ]);
}
