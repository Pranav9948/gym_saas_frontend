'use client'

import React from 'react'
import { Activity, TrendingUp, UserPlus, Percent } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/common'
import { RevenueAreaChart } from '@/components/super-admin/charts/RevenueAreaChart'
import { MemberGrowthChart } from '@/components/super-admin/charts/MemberGrowthChart'
import { PlanDonutChart } from '@/components/super-admin/charts/PlanDonutChart'
import { gyms, planDistribution } from '@/lib/super-admin-mock'
import { StatCard } from '@/components/common/StatCard'

export default function SuperAdminAnalyticsPage() {
  const topGyms = [...gyms].sort((a, b) => b.members - a.members).slice(0, 5)
  const maxMembers = topGyms[0]?.members ?? 1

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Understand growth, retention, and revenue trends across the platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Member Growth"
          value="+43.9%"
          icon={TrendingUp}
          trend={{ value: 'YoY', direction: 'up' }}
        />
        <StatCard
          label="New Signups"
          value="1,284"
          icon={UserPlus}
          trend={{ value: '+11%', direction: 'up' }}
          hint="this month"
        />
        <StatCard
          label="Retention Rate"
          value="92.4%"
          icon={Activity}
          trend={{ value: '+1.3%', direction: 'up' }}
        />
        <StatCard
          label="Churn Rate"
          value="3.1%"
          icon={Percent}
          trend={{ value: '-0.4%', direction: 'up' }}
          hint="lower is better"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue growth</CardTitle>
            <CardDescription>Monthly recurring revenue trend</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member growth</CardTitle>
            <CardDescription>Total active members over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberGrowthChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top performing gyms</CardTitle>
            <CardDescription>Ranked by active membership</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topGyms.map((gym, index) => (
              <div key={gym.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span className="flex size-5 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    {gym.name}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {gym.members.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(gym.members / maxMembers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan mix</CardTitle>
            <CardDescription>Distribution by tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PlanDonutChart />
            <div className="space-y-2">
              {planDistribution.map((item) => (
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
