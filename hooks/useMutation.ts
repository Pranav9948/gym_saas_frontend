'use client';

// ===========================================
// useMutation Hook - TanStack Query mutation wrapper
// ===========================================

import {
  useMutation as useReactQueryMutation,
  useQueryClient,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { parseApiError, type ApiException } from '@/lib/api/errors';
import { toast } from 'sonner';

interface UseMutationHookOptions<TData, TVariables> extends Omit<
  UseMutationOptions<TData, ApiException, TVariables>,
  'mutationFn'
> {
  // Toast messages
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;

  // Cache invalidation
  invalidateKeys?: QueryKey[];
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationHookOptions<TData, TVariables> = {},
) {
  const queryClient = useQueryClient();

  const {
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    invalidateKeys = [],
    onSuccess,
    onError,
    ...restOptions
  } = options;

  return useReactQueryMutation<TData, ApiException, TVariables>({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        throw parseApiError(error);
      }
    },

    onSuccess: (data, variables, onMutateResult, context) => {
      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      if (showErrorToast) {
        const message = errorMessage || error.getUserMessage();
        toast.error(message);
      }

      onError?.(error, variables, onMutateResult, context);
    },

    ...restOptions,
  });
}

// Re-export useQueryClient for cache operations
export { useQueryClient };
