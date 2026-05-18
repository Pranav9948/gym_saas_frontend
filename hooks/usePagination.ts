'use client';

// ===========================================
// usePagination Hook - Pagination state & helpers
// ===========================================

import { useState, useCallback, useMemo } from 'react';
import {
  PAGINATION,
  getValidPage,
  getValidLimit,
  calculateTotalPages,
  getPageRange,
} from '@/constants/pagination';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  total?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageRange: { start: number; end: number };

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  reset: () => void;

  // For API calls
  paginationParams: { page: number; limit: number };
}

export function usePagination(
  options: UsePaginationOptions = {},
): UsePaginationReturn {
  const {
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialLimit = PAGINATION.DEFAULT_LIMIT,
    total: initialTotal = 0,
  } = options;

  const [page, setPageState] = useState(getValidPage(initialPage));
  const [limit, setLimitState] = useState(getValidLimit(initialLimit));
  const [total, setTotalState] = useState(initialTotal);

  // Derived values
  const totalPages = useMemo(
    () => calculateTotalPages(total, limit),
    [total, limit],
  );
  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrevPage = useMemo(() => page > 1, [page]);
  const pageRange = useMemo(
    () => getPageRange(page, limit, total),
    [page, limit, total],
  );

  // Actions
  const setPage = useCallback((newPage: number) => {
    const validPage = getValidPage(newPage);
    setPageState(validPage);
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    const validLimit = getValidLimit(newLimit);
    setLimitState(validLimit);
    // Reset to first page when changing limit
    setPageState(1);
  }, []);

  const setTotal = useCallback((newTotal: number) => {
    setTotalState(Math.max(0, newTotal));
  }, []);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPageState((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPageState((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const firstPage = useCallback(() => {
    setPageState(1);
  }, []);

  const lastPage = useCallback(() => {
    setPageState(totalPages || 1);
  }, [totalPages]);

  const reset = useCallback(() => {
    setPageState(getValidPage(initialPage));
    setLimitState(getValidLimit(initialLimit));
    setTotalState(initialTotal);
  }, [initialPage, initialLimit, initialTotal]);

  // Params for API calls
  const paginationParams = useMemo(() => ({ page, limit }), [page, limit]);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    pageRange,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    reset,
    paginationParams,
  };
}
