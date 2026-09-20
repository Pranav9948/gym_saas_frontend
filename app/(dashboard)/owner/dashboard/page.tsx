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
import { ROUTES } from '@/config'
import {
  owner,
  usage,
  recentCheckins,
  latestMembers,
} from '@/lib/owner-mock'
import {
  OwnerDashboardBillingHeaderActions,
  OwnerDashboardBillingKpis,
  OwnerDashboardCapacityAlert,
  OwnerDashboardPlanSummaryCard,
  OwnerDashboardTrainerSlotsCard,
} from '@/components/owner/dashboard/OwnerDashboardBilling'
import { StatCard } from '@/components/common/StatCard'

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase()
}

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Good morning, {owner.firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is how {owner.firstName === 'Sarah' ? 'IronFit Gym' : 'your gym'} is doing today.
          </p>
        </div>
        <OwnerDashboardBillingHeaderActions />
      </div>

      <OwnerDashboardCapacityAlert />

      <OwnerDashboardBillingKpis />

      {/* Row 2 — Business pulse */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's Check-ins"
          value={String(usage.checkinsToday)}
          icon={ClipboardCheck}
          trend={{ value: `+${usage.checkinsTrendPct}% vs yesterday`, direction: 'up' }}
        />
        <StatCard label="Total Members" value={String(usage.totalMembers)} icon={Users} />
        <StatCard
          label="New This Month"
          value={String(usage.newThisMonth)}
          icon={UserPlus}
          hint="Since July 1"
        />
        <OwnerDashboardTrainerSlotsCard />
      </div>

      {/* Row 3 — Attendance + Plan summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>7-Day Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceBarChart />
          </CardContent>
        </Card>

        <OwnerDashboardPlanSummaryCard />
      </div>

      {/* Row 4 — Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentCheckins.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-accent"
              >
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {c.time}
                  <CheckCircle2 className="size-4 text-success" />
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {latestMembers.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                    {initials(m.firstName, m.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {m.firstName} {m.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.joinedAgo}</p>
                </div>
              </div>
            ))}
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
              <Link href={ROUTES.OWNER_SETTINGS}>
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
    </div >
  )
}
