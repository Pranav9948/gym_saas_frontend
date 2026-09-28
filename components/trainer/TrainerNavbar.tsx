'use client'

import React from 'react'
import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'
import { GymBrand } from '@/components/owner/GymBrand'
import { personInitials } from '@/components/staff/staff-ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useAuth } from '@/hooks'

export function TrainerNavbar() {
  const { user, tenant, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 sm:h-16 md:px-6">
        <div className="min-w-0 flex-1">
          <div className="md:hidden">
            <GymBrand
              name={tenant?.name}
              logoUrl={tenant?.logoUrl}
              subtitle="Trainer"
              iconClassName="size-8 rounded-md"
            />
          </div>
          <div className="hidden md:block">
            <p className="truncate text-sm font-medium">{tenant?.name ?? 'GymFlow'}</p>
            <p className="text-xs text-muted-foreground">Trainer workspace</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:pr-2.5">
              <Avatar className="size-7">
                {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
                <AvatarFallback className="bg-amber-500/15 text-xs font-semibold text-amber-700 dark:text-amber-400">
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
              <Link href={ROUTES.TRAINER_SETTINGS}>
                <Settings className="size-4" />
                Settings
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
    </header>
  )
}
