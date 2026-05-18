'use client';

// ===========================================
// useFetch Hook - TanStack Query wrapper
// ===========================================

import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { parseApiError, type ApiException } from '@/lib/api/errors';

interface UseFetchOptions<TData> extends Omit<
  UseQueryOptions<TData, ApiException, TData, QueryKey>,
  'queryKey' | 'queryFn'
> {
  enabled?: boolean;
}

export function useFetch<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options: UseFetchOptions<TData> = {},
) {
  const {
    enabled = true,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    ...restOptions
  } = options;

  return useQuery<TData, ApiException>({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        throw parseApiError(error);
      }
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry:
      retry ??
      ((failureCount, error) => {
        // Don't retry on auth or permission errors
        if (error.isAuthError?.() || error.isPermissionError?.()) {
          return false;
        }
        return failureCount < 3;
      }),
    ...restOptions,
  });
}

// Prefetch helper for server components
export { useQueryClient } from '@tanstack/react-query';
