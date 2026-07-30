import Link from 'next/link'
import {
  AlertTriangle,
  ArrowUpCircle,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  UserPlus,
  Users,
  UsersRound,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { UsageMeter } from '@/components/owner/UsageMeter'
import { AttendanceBarChart } from '@/components/owner/charts/AttendanceBarChart'
import { ROUTES } from '@/config'
import {
  owner,
  subscription,
  usage,
  recentCheckins,
  latestMembers,
} from '@/lib/owner-mock'
import { StatCard } from '@/components/common/StatCard'

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase()
}

const capacityPct = Math.round((usage.totalMembers / subscription.maxMembers) * 100)

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
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 border-success/30 bg-success/10 text-success"
          >
            <span className="size-1.5 rounded-full bg-success" />
            {subscription.plan} · ACTIVE
          </Badge>
          <Button asChild>
            <Link href={ROUTES.OWNER_BILLING}>
              <ArrowUpCircle className="size-4" />

              Upgrade
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
          <p className="text-sm text-foreground">
            You are near your member limit ({usage.totalMembers}/{subscription.maxMembers}).
            Upgrade to add more members.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 border-warning/40 bg-transparent text-foreground hover:bg-warning/15"
          asChild
        >
          <Link href={ROUTES.OWNER_BILLING}>
            Upgrade Plan
          </Link>
        </Button>
      </div>

      {/* Row 1 — Financial KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-success/10 text-success">
              <CheckCircle2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-success" />
            <p className="text-2xl font-bold tracking-tight text-foreground">ACTIVE</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">All systems operational</p>
        </Card>

        <Card className="gap-0 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Plan &amp; Cost</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="size-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {subscription.plan} Plan
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ${subscription.price}/{subscription.interval}
          </p>
        </Card>

        <Card className="gap-0 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Renewal Date</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarClock className="size-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {subscription.renewalDate}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Renews in {subscription.renewsInDays} days
          </p>
        </Card>

        <Card className="gap-0 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Member Capacity</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <UsersRound className="size-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {usage.totalMembers} / {subscription.maxMembers}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-warning transition-all"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </Card>
      </div>

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
        <Card className="gap-0 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Trainer Slots</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {usage.trainers} / {subscription.maxTrainers}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.round((usage.trainers / subscription.maxTrainers) * 100)}%` }}
            />
          </div>
        </Card>
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Financial &amp; Plan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {subscription.plan} Plan · Monthly · ${subscription.price}/mo
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  Up to {subscription.maxMembers} members
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  Up to {subscription.maxTrainers} trainers
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <UsageMeter label="Members" current={usage.totalMembers} max={subscription.maxMembers} />
              <UsageMeter label="Trainers" current={usage.trainers} max={subscription.maxTrainers} />
            </div>

            <Button className="w-full" asChild>
              <Link href={ROUTES.OWNER_BILLING}>
                Manage Billing
              </Link>
            </Button>

            <Separator />

            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 opacity-70">
              <p className="text-sm font-medium text-muted-foreground">Member Revenue</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
          </CardContent>
        </Card>
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
