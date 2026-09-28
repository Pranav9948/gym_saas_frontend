import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '@/services/super-admin'
import { queryKeys } from '@/services'

export function useNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.superAdmin.notifications(),
    queryFn: () => notificationsService.list(),
    refetchInterval: 15_000,
  })

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.notifications(),
      })
    },
  })

  const markAllRead = useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.notifications(),
      })
    },
  })

  return {
    notifications: query.data?.data.notifications ?? [],
    unreadCount: query.data?.data.unreadCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    markRead: markRead.mutateAsync,
    markAllRead: markAllRead.mutateAsync,
    isMarking: markRead.isPending || markAllRead.isPending,
  }
}
