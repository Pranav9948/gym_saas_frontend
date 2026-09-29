'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { useNotifications } from '@/hooks/super-admin'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { formatRelativeTime } from '@/lib/helpers/formatting'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config'
import { notificationMeta } from '@/components/super-admin/notification-display'
import type { SuperAdminNotification } from '@/types'

export default function SuperAdminNotificationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markRead,
    markAllRead,
    isMarking,
  } = useNotifications()

  const openNotification = async (item: SuperAdminNotification) => {
    if (!item.readAt) {
      try {
        await markRead(item.id)
      } catch {
        // Still navigate so the super admin can act on the event.
      }
    }
    router.push(item.href || ROUTES.SUPER_ADMIN_NOTIFICATIONS)
  }

  const onMarkAll = async () => {
    try {
      await markAllRead()
      toast({ title: 'All caught up', description: 'Every notification is marked as read.' })
    } catch (err) {
      toast({
        title: 'Could not mark all as read',
        description:
          err instanceof ApiException
            ? err.getUserMessage()
            : err instanceof Error
              ? err.message
              : 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="New gyms, join payments, monthly renewals, and owner password changes."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => void refetch()}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            <Button
              className="gap-2"
              disabled={unreadCount === 0 || isMarking}
              onClick={() => void onMarkAll()}
            >
              <CheckCheck className="size-4" />
              Mark all read
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoadingSpinner label="Loading notifications…" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Could not load notifications</p>
          <p className="text-destructive/80">
            {error instanceof ApiException
              ? error.getUserMessage()
              : error instanceof Error
                ? error.message
                : 'Please try again.'}
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-12 opacity-50" />}
          title="No notifications yet"
          description="You will see an alert here when a gym joins, pays, renews, or an owner resets their password."
        />
      ) : (
        <div className="space-y-3">
          {unreadCount > 0 ? (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread
            </p>
          ) : null}
          {notifications.map((item) => {
            const meta = notificationMeta(item.type)
            const Icon = meta.icon
            return (
              <Card
                key={item.id}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/40',
                  !item.readAt && 'border-primary/40 bg-primary/5',
                )}
                onClick={() => void openNotification(item)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <span
                    className={cn(
                      'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ring-1',
                      meta.className,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-medium ring-1',
                          meta.className,
                        )}
                      >
                        {meta.label}
                      </span>
                      {!item.readAt ? (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.message}</p>
                    <p className="text-xs text-muted-foreground/80">
                      {item.gymName ? `${item.gymName} · ` : ''}
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
