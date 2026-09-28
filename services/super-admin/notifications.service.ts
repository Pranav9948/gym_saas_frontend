import { get, patch, post } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/config/api.config'
import type {
  SuperAdminNotificationResponse,
  SuperAdminNotificationsResponse,
} from '@/types'

export const notificationsService = {
  list: async () => {
    return get<SuperAdminNotificationsResponse>(
      API_ENDPOINTS.SUPER_ADMIN.NOTIFICATIONS,
    )
  },

  markRead: async (id: string) => {
    return patch<SuperAdminNotificationResponse>(
      API_ENDPOINTS.SUPER_ADMIN.NOTIFICATION_READ(id),
    )
  },

  markAllRead: async () => {
    return post<SuperAdminNotificationsResponse>(
      API_ENDPOINTS.SUPER_ADMIN.NOTIFICATIONS_READ_ALL,
    )
  },
}
