'use client';

import { billingService } from '@/services/billing.service';
import { useMutation } from '@/hooks/useMutation';

export function useCustomerPortal() {
  return useMutation(() => billingService.createCustomerPortalSession(), {
    showSuccessToast: false,
    showErrorToast: true,
    onSuccess: (response) => {
      if (response.success && response.data.url) {
        window.location.href = response.data.url;
      }
    },
  });
}
