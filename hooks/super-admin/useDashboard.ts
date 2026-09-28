import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/super-admin'
import { queryKeys } from '@/services'

export function useDashboard() {
  const query = useQuery({
    queryKey: queryKeys.superAdmin.dashboard(),
    queryFn: () => dashboardService.get(),
  })

  return {
    dashboard: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
