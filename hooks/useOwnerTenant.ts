'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { tenantService, queryKeys } from '@/services'

export function useOwnerTenant() {
  const tenant = useAuthStore((state) => state.tenant)
  const setTenant = useAuthStore((state) => state.setTenant)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  const query = useQuery({
    queryKey: queryKeys.tenant.current(),
    queryFn: () => tenantService.getTenant(),
    enabled: isAuthenticated && user?.role === 'OWNER',
    staleTime: 60_000,
  })

  useEffect(() => {
    if (query.data?.data) {
      setTenant(query.data.data)
    }
  }, [query.data, setTenant])

  return {
    tenant: query.data?.data ?? tenant,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
