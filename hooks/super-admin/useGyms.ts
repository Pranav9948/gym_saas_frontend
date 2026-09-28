import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gymsService } from '@/services/super-admin'
import { queryKeys } from '@/services'
import { useToast } from '../use-toast'
import { ApiException } from '@/lib/api/errors'

export function useGyms(filters?: {
  page?: number
  limit?: number
  q?: string
  status?: string
}) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const query = useQuery({
    queryKey: queryKeys.superAdmin.gyms.list(filters),
    queryFn: () => gymsService.list(filters),
  })

  const setActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      gymsService.setActive(id, isActive),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.gyms.all(),
      })
      toast({
        title: response.data.isActive ? 'Gym activated' : 'Gym suspended',
        description: response.message,
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Could not update gym',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Please try again.',
        variant: 'destructive',
      })
    },
  })

  return {
    gyms: query.data?.data ?? [],
    meta: query.data?.meta,
    summary: query.data?.summary,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    setGymActive: setActive.mutateAsync,
    isUpdating: setActive.isPending,
  }
}
