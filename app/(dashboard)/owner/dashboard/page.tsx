'use client'

import Link from 'next/link'
import {
  ArrowUpCircle,
  CheckCircle2,
  ClipboardCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AttendanceBarChart } from '@/components/owner/charts/AttendanceBarChart'
import { EmptyState, LoadingSpinner } from '@/components/common'
import { StatCard } from '@/components/common/StatCard'
import { ROUTES } from '@/config'
import { useAuth, useOwnerDashboard } from '@/hooks'
import { ApiException } from '@/lib/api/errors'
import { formatRelativeTime } from '@/lib/helpers/formatting'
import {
  OwnerDashboardBillingHeaderActions,
  OwnerDashboardBillingKpis,
  OwnerDashboardCapacityAlert,
  OwnerDashboardPlanSummaryCard,
  OwnerDashboardTrainerSlotsCard,
} from '@/components/owner/dashboard/OwnerDashboardBilling'

function initials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || 'M'
}

function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function checkInTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function monthHint(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'This month'
  return `Since ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
}

export default function OwnerDashboardPage() {
  const { user } = useAuth()
  const { dashboard, isLoading, error } = useOwnerDashboard()
  const firstName = user?.firstName || 'there'
  const gymName = dashboard?.gymName ?? 'your gym'
  const summary = dashboard?.summary

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is how {gymName} is doing today.
          </p>
        </div>
        <OwnerDashboardBillingHeaderActions />
      </div>

      <OwnerDashboardCapacityAlert />

      <OwnerDashboardBillingKpis />

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoadingSpinner label="Loading gym activity…" />
        </div>
      ) : error ? (
        <EmptyState
          title="Could not load dashboard"
          description={
            error instanceof ApiException
              ? error.getUserMessage()
              : 'Check your connection and try again.'
          }
        />
      ) : summary ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's Check-ins"
            value={String(summary.checkinsToday)}
            icon={ClipboardCheck}
            trend={{
              value:
                summary.checkinsTrendPct === 0
                  ? 'Same as yesterday'
                  : `${summary.checkinsTrendPct > 0 ? '+' : ''}${summary.checkinsTrendPct}% vs yesterday`,
              direction: summary.checkinsTrendPct < 0 ? 'down' : 'up',
            }}
          />
          <StatCard
            label="Total Members"
            value={String(summary.totalMembers)}
            icon={Users}
            hint={`${summary.activeMembers} active`}
          />
          <StatCard
            label="New This Month"
            value={String(summary.newThisMonth)}
            icon={UserPlus}
            hint={monthHint(summary.monthStart)}
          />
          <OwnerDashboardTrainerSlotsCard />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>7-Day Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner label="Loading attendance…" />
              </div>
            ) : (
              <AttendanceBarChart data={dashboard?.attendanceTrend ?? []} />
            )}
          </CardContent>
        </Card>

        <OwnerDashboardPlanSummaryCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {(dashboard?.recentCheckins.length ?? 0) === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No check-ins yet this week.
              </p>
            ) : (
              dashboard?.recentCheckins.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-accent"
                >
                  <span className="text-sm font-medium text-foreground">
                    {checkin.name}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {checkInTime(checkin.checkIn)}
                    <CheckCircle2 className="size-4 text-success" />
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {(dashboard?.latestMembers.length ?? 0) === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No members yet. Add your first member to get started.
              </p>
            ) : (
              dashboard?.latestMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                      {initials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {formatRelativeTime(member.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start gap-2" asChild>
              <Link href={ROUTES.OWNER_MEMBERS}>
                <UserPlus className="size-4" />
                Add Member
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2" asChild>
              <Link href={ROUTES.OWNER_MEMBERS}>
                <Users className="size-4" />
                Invite Staff
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2" asChild>
              <Link href={ROUTES.OWNER_BILLING}>
                <ArrowUpCircle className="size-4" />
                Upgrade Plan
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2" asChild>
              <Link href={ROUTES.OWNER_MEMBERS}>
                <Users className="size-4" />
                View All Members
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
