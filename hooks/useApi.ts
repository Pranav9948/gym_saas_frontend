'use client';

// ===========================================
// useApi Hook - API call wrapper with error handling
// ===========================================

import { useCallback, useState } from 'react';
import { ApiException, parseApiError } from '@/lib/api/errors';
import { toast } from 'sonner';

interface UseApiOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

interface UseApiReturn<T, A extends unknown[]> {
  data: T | null;
  error: ApiException | null;
  isLoading: boolean;
  execute: (...args: A) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, A extends unknown[] = []>(
  apiFunction: (...args: A) => Promise<T>,
  options: UseApiOptions = {},
): UseApiReturn<T, A> {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiException | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: A): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        return result;
      } catch (err) {
        const apiError = parseApiError(err);
        setError(apiError);

        if (showErrorToast) {
          toast.error(apiError.getUserMessage());
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, showErrorToast, showSuccessToast, successMessage],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}

// Simplified version for mutations that don't need to store data
export function useApiMutation<T, A extends unknown[] = []>(
  apiFunction: (...args: A) => Promise<T>,
  options: UseApiOptions = {},
): {
  mutate: (...args: A) => Promise<T | null>;
  isLoading: boolean;
  error: ApiException | null;
  reset: () => void;
} {
  const { execute, isLoading, error, reset } = useApi(apiFunction, options);

  return {
    mutate: execute,
    isLoading,
    error,
    reset,
  };
}
