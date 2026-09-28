'use client'

import React from 'react'
import Link from 'next/link'
import { LogOut, Menu, Settings, User } from 'lucide-react'
import { GymBrand } from '@/components/owner/GymBrand'
import { personInitials } from '@/components/staff/staff-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/config'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks'
import type { TenantRole } from '@/types'

interface StaffNavbarProps {
  onMenuClick: () => void
}

export function StaffNavbar({ onMenuClick }: StaffNavbarProps) {
  const { user, tenant, logout } = useAuth()
  const roleLabel =
    user?.role && user.role in ROLE_LABELS
      ? ROLE_LABELS[user.role as TenantRole]
      : user?.role

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 sm:h-16 md:px-6">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="min-w-0 flex-1 md:hidden">
          <GymBrand
            name={tenant?.name}
            logoUrl={tenant?.logoUrl}
            subtitle="Staff"
            iconClassName="size-8 rounded-md"
          />
        </div>

        <div className="hidden min-w-0 flex-1 md:block">
          <p className="truncate text-sm font-medium text-foreground">
            {tenant?.name ?? 'GymFlow'}
          </p>
          <p className="truncate text-xs text-muted-foreground">Staff workspace</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {roleLabel ? (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {roleLabel}
            </Badge>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:pr-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                    {personInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
                  {user?.firstName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="truncate text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {user?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.SETTINGS_PROFILE}>
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.SETTINGS}>
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => logout()}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
