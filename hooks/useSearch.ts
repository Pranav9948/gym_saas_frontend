'use client';

// ===========================================
// useSearch Hook - Search with debounce + filters
// ===========================================

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions<TFilters> {
  initialSearch?: string;
  initialFilters?: TFilters;
  debounceMs?: number;
}

interface UseSearchReturn<TFilters> {
  // Raw search value (updates immediately)
  searchInput: string;
  // Debounced search value (use for API calls)
  search: string;
  // Filters
  filters: TFilters;
  // Combined params for API
  searchParams: { search: string } & TFilters;

  // Actions
  setSearchInput: (value: string) => void;
  setFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
  setFilters: (filters: Partial<TFilters>) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  reset: () => void;
}

export function useSearch<
  TFilters extends Record<string, unknown> = Record<string, never>,
>(options: UseSearchOptions<TFilters> = {}): UseSearchReturn<TFilters> {
  const {
    initialSearch = '',
    initialFilters = {} as TFilters,
    debounceMs = 300,
  } = options;

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [filters, setFiltersState] = useState<TFilters>(initialFilters);

  // Debounced search value
  const search = useDebounce(searchInput, debounceMs);

  // Combined params for API calls
  const searchParams = useMemo(
    () => ({
      search,
      ...filters,
    }),
    [search, filters],
  );

  // Set single filter
  const setFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFiltersState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  // Set multiple filters
  const setFilters = useCallback((newFilters: Partial<TFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, [initialFilters]);

  // Reset all
  const reset = useCallback(() => {
    setSearchInput(initialSearch);
    setFiltersState(initialFilters);
  }, [initialSearch, initialFilters]);

  return {
    searchInput,
    search,
    filters,
    searchParams,
    setSearchInput,
    setFilter,
    setFilters,
    clearSearch,
    clearFilters,
    reset,
  };
}
