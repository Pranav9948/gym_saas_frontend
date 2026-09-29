import { useQuery } from '@tanstack/react-query'
import { tenantService } from '@/services'
import { queryKeys } from '@/services/queryKeys'

export function useOwnerDashboard() {
  const query = useQuery({
    queryKey: queryKeys.tenant.dashboard(),
    queryFn: () => tenantService.getDashboard(),
  })

  return {
    dashboard: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
