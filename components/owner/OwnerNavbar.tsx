'use client'

import React from 'react'
import Link from 'next/link'
import { Search, Plus, UserPlus, ArrowUpCircle, User, Settings } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useOwnerTenant } from '@/hooks/useOwnerTenant'
import { useBillingSummary } from '@/hooks/billing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { GymBrand } from '@/components/owner/GymBrand'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/config'

export function OwnerNavbar() {
  const { user, logout } = useAuth()
  const { data: billingSummary } = useBillingSummary()
  const { tenant } = useOwnerTenant()

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'OW'

  const activePlan =
    billingSummary?.data?.plan.name ??
    tenant?.subscriptions?.find((subscription) => subscription.status === 'ACTIVE')
      ?.plan?.name ??
    'FREE'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <div className="hidden shrink-0 sm:flex">
          <GymBrand
            name={tenant?.name}
            logoUrl={tenant?.logoUrl}
            subtitle="Owner Portal"
            iconClassName="size-8 rounded-md"
          />
        </div>

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="h-9 w-full pl-9"
            aria-label="Search members"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden gap-1.5 border-success/30 bg-success/10 text-success sm:inline-flex"
          >
            <span className="size-1.5 rounded-full bg-success" />
            {activePlan} · ACTIVE
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" aria-label="Quick actions">
                <Plus className="size-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.OWNER_MEMBERS}>
                  <UserPlus className="size-4" />
                  <span>Add Member</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${ROUTES.OWNER_SETTINGS}?tab=team`}>
                  <User className="size-4" />
                  <span>Invite Staff</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.OWNER_BILLING}>
                  <ArrowUpCircle className="size-4" />
                  <span>Upgrade Plan</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`${ROUTES.OWNER_SETTINGS}?tab=account`}>
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.OWNER_SETTINGS}>
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
