'use client'

import React from 'react'
import {
  Building2,
  MapPin,
  MoreHorizontal,
  Search,
  Users,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  EmptyState,
  LoadingSpinner,
  PageHeader,
  Pagination,
  StatusBadge,
} from '@/components/common'
import { StatCard } from '@/components/common/StatCard'
import { useGyms } from '@/hooks/super-admin'
import { useDebounce } from '@/hooks'
import type { StatusType, SuperAdminGym } from '@/types'

const filters: Array<{ value: 'all' | StatusType; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'TRIAL', label: 'Trial' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
]

function currency(value: number, code = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code || 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function planLabel(gym: SuperAdminGym) {
  if (!gym.plan) return 'No plan'
  const name = gym.plan.charAt(0) + gym.plan.slice(1).toLowerCase()
  if (!gym.planInterval) return name
  return `${name} · ${gym.planInterval.toLowerCase()}`
}

function subscriptionLabel(gym: SuperAdminGym) {
  if (!gym.plan && gym.daysRemaining == null && !gym.subscriptionEnded) {
    return 'No subscription'
  }
  if (gym.subscriptionEnded) return 'Subscription ended'
  if (gym.daysRemaining == null) return 'No end date'
  if (gym.daysRemaining === 0) return 'Ends today'
  if (gym.daysRemaining === 1) return '1 day left'
  return `${gym.daysRemaining} days left`
}

function ownerName(gym: SuperAdminGym) {
  if (!gym.owner) return 'No owner'
  return `${gym.owner.firstName} ${gym.owner.lastName}`.trim()
}

function gymInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

const statusMap: Record<SuperAdminGymStatus, StatusType> = {
  active: 'ACTIVE',
  trial: 'PENDING',
  suspended: 'BANNED',
  pending: 'PENDING',
}

export default function SuperAdminGymsPage() {
  const { data, isLoading, isError, refetch } = useSuperAdminDashboard()
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<'all' | StatusType>('all')
  const [page, setPage] = React.useState(1)
  const search = useDebounce(query, 300)

  React.useEffect(() => {
    setPage(1)
  }, [search, status])

  const { gyms, meta, summary, isLoading, error, setGymActive, isUpdating } =
    useGyms({
      page,
      limit: 20,
      q: search.trim() || undefined,
      status: status === 'all' ? undefined : status,
    })

  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gyms"
        description="Every gym registered on the platform, with owners, plans, and members."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Gyms"
          value={(summary?.totalGyms ?? 0).toString()}
          icon={Building2}
        />
        <StatCard
          label="Active Gyms"
          value={(summary?.activeGyms ?? 0).toString()}
          icon={Building2}
        />
        <StatCard
          label="Total Members"
          value={(summary?.totalMembers ?? 0).toLocaleString()}
          icon={Users}
        />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search gyms, owners, cities..."
                className="pl-9"
                aria-label="Search gyms"
              />
            </div>

            <Tabs
              value={status}
              onValueChange={(value) => setStatus(value as 'all' | StatusType)}
              className="w-full lg:w-auto"
            >
              <TabsList className="w-full justify-start overflow-x-auto lg:w-auto">
                {filters.map((filter) => (
                  <TabsTrigger key={filter.value} value={filter.value}>
                    {filter.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <LoadingSpinner label="Loading gyms…" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-medium">Could not load gyms</p>
              <p className="text-destructive/80">
                {error instanceof Error ? error.message : 'Please try again.'}
              </p>
            </div>
          ) : gyms.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-8 w-8" />}
              title={search || status !== 'all' ? 'No gyms found' : 'No gyms yet'}
              description={
                search || status !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'Gyms appear here after owners register on the platform.'
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gym</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead className="text-right">Members</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gyms.map((gym) => (
                      <TableRow key={gym.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              {gym.logoUrl ? (
                                <AvatarImage src={gym.logoUrl} alt="" />
                              ) : null}
                              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                {gymInitials(gym.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">
                                {gym.name}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="size-3" />
                                {gym.location}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <p className="truncate text-foreground">
                              {ownerName(gym)}
                            </p>
                            {gym.owner?.email ? (
                              <p className="truncate text-xs text-muted-foreground">
                                {gym.owner.email}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>{planLabel(gym)}</TableCell>
                        <TableCell>
                          <p
                            className={
                              gym.subscriptionEnded
                                ? 'font-medium text-destructive'
                                : 'text-foreground'
                            }
                          >
                            {subscriptionLabel(gym)}
                          </p>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {gym.members.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {gym.revenue ? currency(gym.revenue, gym.currency) : '—'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={gym.status}
                            label={
                              gym.status.charAt(0) +
                              gym.status.slice(1).toLowerCase()
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Actions for ${gym.name}`}
                                disabled={isUpdating}
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {gym.isActive ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    void setGymActive({
                                      id: gym.id,
                                      isActive: false,
                                    })
                                  }
                                >
                                  Suspend gym
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    void setGymActive({
                                      id: gym.id,
                                      isActive: true,
                                    })
                                  }
                                >
                                  Activate gym
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 ? (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  isLoading={isUpdating}
                />
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
