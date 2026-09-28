import { useQuery } from '@tanstack/react-query'
import { billingService } from '@/services/super-admin'
import { queryKeys } from '@/services'

export function useBilling() {
  const query = useQuery({
    queryKey: queryKeys.superAdmin.billing(),
    queryFn: () => billingService.get(),
  })

  return {
    billing: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
