'use client';

import { billingService } from '@/services/billing.service';
import { useMutation } from '@/hooks/useMutation';
import { ErrorCode } from '@/lib/api/errors';
import { billingTrace, billingTraceRedirect } from '@/lib/billing/trace';
import { toast } from 'sonner';
import type { ApiException } from '@/lib/api/errors';
import type { CheckoutSessionRequest } from '@/types/billing';

export function useCheckoutSession() {
  return useMutation(
    (payload: CheckoutSessionRequest) =>
      billingService.createCheckoutSession(payload),
    {
      showSuccessToast: false,
      showErrorToast: false,
      onSuccess: (response) => {
        if (response.success && response.data.url) {
          billingTrace('Checkout mutation success → redirect', {
            note: `session URL host: ${new URL(response.data.url).host}`,
          });
          billingTraceRedirect(response.data.url, 'Stripe Checkout');
          window.location.href = response.data.url;
        }
      },
      onError: (error: ApiException) => {
        billingTrace('Checkout mutation error', {
          error: {
            status: error.status,
            errorCode: error.errorCode,
            message: error.message,
          },
        });

        if (error.errorCode === ErrorCode.RESOURCE_ALREADY_EXISTS) {
          toast.error(
            'You already have an active paid subscription. Use Manage Subscription to change your plan.',
          );
          return;
        }

        toast.error(error.getUserMessage());
      },
    },
  );
}
