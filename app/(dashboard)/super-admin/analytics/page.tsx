'use client'

import React from 'react'
import { Activity, Building2, Percent, TrendingUp, UserPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { RevenueAreaChart } from '@/components/super-admin/charts/RevenueAreaChart'
import { MemberGrowthChart } from '@/components/super-admin/charts/MemberGrowthChart'
import { PlanDonutChart } from '@/components/super-admin/charts/PlanDonutChart'
import { StatCard } from '@/components/common/StatCard'
import { useAnalytics } from '@/hooks/super-admin'
import { ApiException } from '@/lib/api/errors'
import type { SuperAdminPlanMixName } from '@/types'

const planStyles: Record<SuperAdminPlanMixName, { label: string; fill: string }> = {
  FREE: { label: 'Free', fill: 'var(--color-chart-4)' },
  BASIC: { label: 'Basic', fill: 'var(--color-chart-1)' },
  PRO: { label: 'Pro', fill: 'var(--color-chart-2)' },
  NONE: { label: 'No plan', fill: 'var(--color-muted-foreground)' },
}

function signedPercent(value: number | null) {
  if (value == null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

function plainPercent(value: number) {
  return `${value.toFixed(1)}%`
}

export default function SuperAdminAnalyticsPage() {
  const { analytics, isLoading, error } = useAnalytics()
  const summary = analytics?.summary
  const topGyms = analytics?.topGyms ?? []
  const maxMembers = topGyms[0]?.members ?? 1
  const planMix = (analytics?.planMix ?? []).map((item) => ({
    plan: planStyles[item.plan].label,
    gyms: item.gyms,
    fill: planStyles[item.plan].fill,
  }))

  const growthTrend =
    summary?.memberGrowthPercent == null
      ? undefined
      : {
          value: 'vs last month',
          direction: (summary.memberGrowthPercent < 0 ? 'down' : 'up') as 'up' | 'down',
        }

  const signupTrend =
    summary?.newSignupsChangePercent == null
      ? undefined
      : {
          value: signedPercent(summary.newSignupsChangePercent),
          direction: (summary.newSignupsChangePercent < 0 ? 'down' : 'up') as
            | 'up'
            | 'down',
        }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Growth, retention, and revenue across every gym on the platform."
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner label="Loading analytics…" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Could not load analytics</p>
          <p className="text-destructive/80">
            {error instanceof ApiException
              ? error.getUserMessage()
              : error instanceof Error
                ? error.message
                : 'Please try again.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Member growth"
              value={signedPercent(summary?.memberGrowthPercent ?? null)}
              icon={TrendingUp}
              trend={growthTrend}
              hint={
                summary?.memberGrowthPercent == null
                  ? 'no prior month baseline'
                  : `${summary.totalMembers.toLocaleString()} members total`
              }
            />
            <StatCard
              label="New signups"
              value={(summary?.newSignupsThisMonth ?? 0).toLocaleString()}
              icon={UserPlus}
              trend={signupTrend}
              hint="this month"
            />
            <StatCard
              label="Retention rate"
              value={plainPercent(summary?.retentionRate ?? 0)}
              icon={Activity}
              hint={`${summary?.activeMembers ?? 0} active members`}
            />
            <StatCard
              label="Churn rate"
              value={plainPercent(summary?.churnRate ?? 0)}
              icon={Percent}
              hint="inactive and banned"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue growth</CardTitle>
                <CardDescription>
                  Monthly recurring revenue of current subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueAreaChart
                  data={analytics?.revenue ?? []}
                  currency={summary?.currency ?? 'USD'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member growth</CardTitle>
                <CardDescription>Total members over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <MemberGrowthChart data={analytics?.members ?? []} />
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
                {topGyms.length === 0 ? (
                  <EmptyState
                    icon={<Building2 className="h-8 w-8" />}
                    title="No members yet"
                    description="Gyms appear here once they start adding members."
                  />
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
                          {gym.members.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${maxMembers > 0 ? (gym.members / maxMembers) * 100 : 0}%`,
                          }}
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
                {planMix.length === 0 ? (
                  <EmptyState
                    icon={<Building2 className="h-8 w-8" />}
                    title="No plans yet"
                    description="Plan mix appears after gyms subscribe."
                  />
                ) : (
                  <>
                    <PlanDonutChart data={planMix} />
                    <div className="space-y-2">
                      {planMix.map((item) => (
                        <div
                          key={item.plan}
                          className="flex items-center justify-between text-sm"
                        >
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
