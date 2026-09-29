'use client'

import React from 'react'
import { Activity, Percent, TrendingUp, UserPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { RevenueAreaChart } from '@/components/super-admin/charts/RevenueAreaChart'
import { MemberGrowthChart } from '@/components/super-admin/charts/MemberGrowthChart'
import { PlanDonutChart } from '@/components/super-admin/charts/PlanDonutChart'
import { StatCard } from '@/components/common/StatCard'
import { useSuperAdminDashboard } from '@/hooks/super-admin'

export default function SuperAdminAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useSuperAdminDashboard()
  const dashboard = data?.data

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (isError || !dashboard) {
    return (
      <EmptyState
        title="Unable to load analytics"
        description="Could not load analytics from the database."
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    )
  }

  const topGyms = [...dashboard.gyms].sort((a, b) => b.members - a.members).slice(0, 5)
  const maxMembers = topGyms[0]?.members ?? 1

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Growth, retention, and revenue from live gym data."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Member Growth"
          value={`${dashboard.analytics.memberGrowthPct > 0 ? '+' : ''}${dashboard.analytics.memberGrowthPct}%`}
          icon={TrendingUp}
          hint="vs last year"
        />
        <StatCard
          label="New Signups"
          value={dashboard.analytics.newSignups.toLocaleString('en-IN')}
          icon={UserPlus}
          hint="this month"
        />
        <StatCard
          label="Retention Rate"
          value={`${dashboard.analytics.retentionRate}%`}
          icon={Activity}
          hint="active members"
        />
        <StatCard
          label="Churn Rate"
          value={`${dashboard.analytics.churnRate}%`}
          icon={Percent}
          hint="lower is better"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue growth</CardTitle>
            <CardDescription>New subscription value by month (INR)</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart data={dashboard.revenueTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member growth</CardTitle>
            <CardDescription>Total members over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberGrowthChart data={dashboard.memberGrowth} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top performing gyms</CardTitle>
            <CardDescription>Ranked by membership</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topGyms.length === 0 ? (
              <EmptyState title="No gyms yet" description="Gyms will rank here by member count." />
            ) : (
              topGyms.map((gym, index) => (
                <div key={gym.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground">
                        {index + 1}
                      </span>
                      {gym.name}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {gym.members.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(gym.members / maxMembers) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan mix</CardTitle>
            <CardDescription>Distribution by tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PlanDonutChart data={dashboard.planDistribution} />
            <div className="space-y-2">
              {dashboard.planDistribution.map((item) => (
                <div key={item.plan} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.plan}
                  </span>
                  <span className="font-medium text-foreground">{item.gyms}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
