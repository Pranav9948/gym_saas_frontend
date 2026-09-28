import { useQuery } from '@tanstack/react-query'
import { ownersService } from '@/services/super-admin'
import { queryKeys } from '@/services'

export function useOwners(filters?: {
  page?: number
  limit?: number
  q?: string
  status?: string
}) {
  const query = useQuery({
    queryKey: queryKeys.superAdmin.owners.list(filters),
    queryFn: () => ownersService.list(filters),
  })

  return {
    owners: query.data?.data ?? [],
    meta: query.data?.meta,
    summary: query.data?.summary,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export function useOwner(id: string | undefined) {
  const query = useQuery({
    queryKey: queryKeys.superAdmin.owners.detail(id ?? ''),
    queryFn: () => ownersService.getById(id!),
    enabled: Boolean(id),
  })

  return {
    owner: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
