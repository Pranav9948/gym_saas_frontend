import { useQuery } from '@tanstack/react-query'
import { superAdminAnalyticsService } from '@/services/super-admin'
import { queryKeys } from '@/services'

export function useAnalytics() {
  const query = useQuery({
    queryKey: queryKeys.superAdmin.analytics(),
    queryFn: () => superAdminAnalyticsService.get(),
  })

  return {
    analytics: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
