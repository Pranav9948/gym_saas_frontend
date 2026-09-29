'use client'

import React from 'react'
import Link from 'next/link'
import { Search, User } from 'lucide-react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SuperAdminNotificationsBell } from '@/components/super-admin/SuperAdminNotificationsBell'
import { ROUTES } from '@/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SuperAdminNavbar() {
  const { user, logout } = useAuth()
  const initials = `${user?.firstName?.[0] ?? 'S'}${user?.lastName?.[0] ?? 'A'}`.toUpperCase()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            Welcome back, {user?.firstName || 'Super Admin'}
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Here is what is happening across your platform today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search gyms, owners..."
              className="h-9 w-56 pl-9"
              aria-label="Search"
            />
          </div>

          <SuperAdminNotificationsBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:pr-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">
                  {user?.firstName}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={ROUTES.SUPER_ADMIN_SETTINGS}>
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={logout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  )
}
