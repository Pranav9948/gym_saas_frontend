'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  Phone,
  Search,
  Users,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  EmptyState,
  LoadingSpinner,
  PageHeader,
  Pagination,
  StatusBadge,
} from '@/components/common'
import { StatCard } from '@/components/common/StatCard'
import {
  daysCountLabel,
  ownerFullName,
  ownerInitials,
  ownerPhoto,
  planLabel,
  subscriptionLabel,
} from '@/components/super-admin/owner-display'
import { ROUTES } from '@/config'
import { useOwners } from '@/hooks/super-admin'
import { useDebounce } from '@/hooks'
import type { StatusType } from '@/types'

const filters: Array<{ value: 'all' | StatusType; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'TRIAL', label: 'Trial' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
]

export default function SuperAdminOwnersPage() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<'all' | StatusType>('all')
  const [page, setPage] = React.useState(1)
  const search = useDebounce(query, 300)

  React.useEffect(() => {
    setPage(1)
  }, [search, status])

  const { owners, meta, summary, isLoading, error } = useOwners({
    page,
    limit: 12,
    q: search.trim() || undefined,
    status: status === 'all' ? undefined : status,
  })

  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owners"
        description="Gym owners on the platform, with contact details and how long their subscription still has left."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Total owners"
          value={(summary?.totalOwners ?? 0).toString()}
          icon={Users}
        />
        <StatCard
          label="Active subscriptions"
          value={(summary?.activeSubscriptions ?? 0).toString()}
          icon={CalendarDays}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search owners, gyms, phone..."
            className="pl-9"
            aria-label="Search owners"
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
          <LoadingSpinner label="Loading owners…" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Could not load owners</p>
          <p className="text-destructive/80">
            {error instanceof Error ? error.message : 'Please try again.'}
          </p>
        </div>
      ) : owners.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title={search || status !== 'all' ? 'No owners found' : 'No owners yet'}
          description={
            search || status !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Owners appear here after they register a gym.'
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {owners.map((owner) => {
              const photo = ownerPhoto(owner)
              return (
                <Card key={owner.id} className="overflow-hidden border border-border shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-14">
                        {photo ? <AvatarImage src={photo} alt="" /> : null}
                        <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                          {ownerInitials(owner)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {ownerFullName(owner)}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {owner.email}
                        </p>
                        <div className="mt-1">
                          <StatusBadge
                            status={owner.status}
                            label={
                              owner.status.charAt(0) +
                              owner.status.slice(1).toLowerCase()
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="size-3.5 shrink-0" />
                        <span className="truncate">{owner.gym.name}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="truncate">{owner.gym.location}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="size-3.5 shrink-0" />
                        <span className="truncate">
                          {owner.gym.contactPhone || 'No phone on file'}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-3">
                      <p
                        className={
                          owner.subscriptionEnded
                            ? 'font-semibold text-destructive'
                            : 'font-semibold'
                        }
                      >
                        {subscriptionLabel(owner)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {planLabel(owner)} · On platform{' '}
                        {daysCountLabel(owner.daysOnPlatform).toLowerCase()}
                      </p>
                    </div>

                    <Button
                      asChild
                      className="w-full gap-2 bg-gradient-to-r from-primary to-accent font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:from-primary/90 hover:to-accent/90 hover:shadow-lg hover:shadow-primary/30"
                    >
                      <Link href={ROUTES.SUPER_ADMIN_OWNER(owner.id)}>
                        View details
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {totalPages > 1 ? (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
