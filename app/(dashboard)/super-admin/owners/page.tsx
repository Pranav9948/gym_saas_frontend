'use client'

import React from 'react'
import { Building2, Mail, Phone, Search, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  EmptyState,
  LoadingSpinner,
  PageHeader,
  Pagination,
  StatusBadge,
} from '@/components/common'
import { StatCard } from '@/components/common/StatCard'
import { useSuperAdminOwners } from '@/hooks/super-admin'
import {
  formatFullName,
  formatInitials,
  formatPhone,
  formatRelativeTime,
  formatShortDate,
} from '@/lib/helpers/formatting'
import { StatusType, SubscriptionStatus } from '@/types'
import type { OwnerWithGym } from '@/types'

const subscriptionStatusMap: Record<SubscriptionStatus, StatusType> = {
  ACTIVE: 'ACTIVE',
  TRIALING: 'TRIAL',
  PAST_DUE: 'PENDING',
  CANCELED: 'INACTIVE',
  INCOMPLETE: 'PENDING',
}

function ownerStatus(owner: OwnerWithGym): { status: StatusType; label: string } {
  if (!owner.user.isActive) {
    return { status: 'INACTIVE', label: 'Inactive' }
  }
  if (!owner.tenant.isActive) {
    return { status: 'SUSPENDED', label: 'Gym suspended' }
  }
  if (!owner.subscription) {
    return { status: 'PENDING', label: 'No plan' }
  }
  const status = subscriptionStatusMap[owner.subscription.status] ?? 'PENDING'
  return {
    status,
    label: owner.subscription.status.replaceAll('_', ' ').toLowerCase(),
  }
}

export default function SuperAdminOwnersPage() {
  const [page, setPage] = React.useState(1)
  const [query, setQuery] = React.useState('')
  const { data, isLoading, isError, isFetching, refetch } = useSuperAdminOwners(page, 10)

  if (isLoading && !data) {
    return <LoadingSpinner fullScreen />
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Unable to load owners"
        description="Could not load gym owners from the database."
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    )
  }

  const owners = data.data
  const filtered = owners.filter((owner) => {
    const haystack = [
      owner.user.firstName,
      owner.user.lastName,
      owner.user.email,
      owner.tenant.name,
      owner.tenant.city,
      owner.tenant.contactPhone,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query.toLowerCase())
  })

  const activeOwners = owners.filter(
    (owner) => owner.user.isActive && owner.tenant.isActive,
  ).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owners"
        description="Gym owners on the platform, with contact details and subscription remaining days."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Owners"
          value={data.meta.total.toLocaleString('en-IN')}
          icon={Users}
        />
        <StatCard
          label="Active Owners"
          value={activeOwners.toString()}
          icon={Users}
        />
        <StatCard
          label="Gyms"
          value={owners.length.toString()}
          icon={Building2}
          hint="on this page"
        />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search owners, gyms, cities..."
              className="pl-9"
              aria-label="Search owners"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Users className="h-8 w-8" />}
              title="No owners found"
              description="Try adjusting your search."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Gym</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Days left</TableHead>
                    <TableHead>Present since</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((owner) => {
                    const fullName = formatFullName(
                      owner.user.firstName,
                      owner.user.lastName,
                    )
                    const initials = formatInitials(
                      owner.user.firstName,
                      owner.user.lastName,
                    )
                    const { status, label } = ownerStatus(owner)
                    const daysLeft = owner.subscription?.daysRemaining
                    const daysUrgent =
                      typeof daysLeft === 'number' && daysLeft > 0 && daysLeft <= 7

                    return (
                      <TableRow key={owner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              {owner.user.avatarUrl ? (
                                <AvatarImage
                                  src={owner.user.avatarUrl}
                                  alt={fullName}
                                />
                              ) : null}
                              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">
                                {fullName}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {owner.user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Mail className="size-3.5 shrink-0" />
                              <span className="truncate">
                                {owner.tenant.contactEmail || owner.user.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="size-3.5 shrink-0" />
                              <span>
                                {formatPhone(owner.tenant.contactPhone)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              {owner.tenant.logoUrl ? (
                                <AvatarImage
                                  src={owner.tenant.logoUrl}
                                  alt={owner.tenant.name}
                                />
                              ) : null}
                              <AvatarFallback className="bg-muted text-[10px] font-semibold">
                                {owner.tenant.name
                                  .split(' ')
                                  .slice(0, 2)
                                  .map((word) => word[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate font-medium">
                                {owner.tenant.name}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {[owner.tenant.city, owner.tenant.country]
                                  .filter(Boolean)
                                  .join(', ') || '—'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {owner.subscription
                            ? `${owner.subscription.planName} · ${owner.subscription.interval.toLowerCase()}`
                            : '—'}
                        </TableCell>
                        <TableCell>
                          {typeof daysLeft === 'number' ? (
                            <span
                              className={
                                daysUrgent
                                  ? 'font-semibold text-destructive'
                                  : 'font-mono'
                              }
                            >
                              {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                            </span>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {owner.presentSinceDays}{' '}
                            {owner.presentSinceDays === 1 ? 'day' : 'days'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatShortDate(owner.tenant.createdAt)} ·{' '}
                            {formatRelativeTime(owner.tenant.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={status} label={label} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {data.meta.totalPages > 1 ? (
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
              isLoading={isFetching}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
