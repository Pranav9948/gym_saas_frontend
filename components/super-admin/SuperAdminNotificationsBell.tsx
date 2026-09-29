'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications } from '@/hooks/super-admin'
import { formatRelativeTime } from '@/lib/helpers/formatting'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config'
import { notificationMeta } from './notification-display'
import type { SuperAdminNotification } from '@/types'

export function SuperAdminNotificationsBell() {
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    isMarking,
  } = useNotifications()
  const preview = notifications.slice(0, 8)

  const openNotification = async (item: SuperAdminNotification) => {
    if (!item.readAt) {
      try {
        await markRead(item.id)
      } catch {
        // Navigation still proceeds; unread state refreshes on the next poll.
      }
    }
    router.push(item.href || ROUTES.SUPER_ADMIN_NOTIFICATIONS)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4.5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground ring-2 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <DropdownMenuLabel className="flex items-center justify-between gap-2 px-3 py-2.5">
          <span>Notifications</span>
          {unreadCount > 0 ? (
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
              disabled={isMarking}
              onClick={() => void markAllRead()}
            >
              Mark all read
            </button>
          ) : null}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="m-0" />

        {isLoading ? (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            Loading notifications…
          </p>
        ) : preview.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            No notifications yet.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto py-1">
            {preview.map((item) => {
              const meta = notificationMeta(item.type)
              const Icon = meta.icon
              return (
                <DropdownMenuItem
                  key={item.id}
                  className={cn(
                    'items-start gap-2.5 rounded-none px-3 py-2.5',
                    !item.readAt && 'bg-primary/5',
                  )}
                  onSelect={() => {
                    void openNotification(item)
                  }}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ring-1',
                      meta.className,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 space-y-0.5">
                    <span className="flex items-start justify-between gap-2">
                      <span className="line-clamp-1 text-sm font-medium">{item.title}</span>
                      {!item.readAt ? (
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {item.message}
                    </span>
                    <span className="text-[11px] text-muted-foreground/80">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </span>
                </DropdownMenuItem>
              )
            })}
          </div>
        )}

        <DropdownMenuSeparator className="m-0" />

        <DropdownMenuItem asChild className="justify-center rounded-none py-2.5">
          <Link href={ROUTES.SUPER_ADMIN_NOTIFICATIONS} className="text-sm font-medium">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
