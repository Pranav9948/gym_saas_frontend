'use client'

import React from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  DollarSign,
  CreditCard,
  ArrowRight,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  EmptyState,
  LoadingSpinner,
  PageHeader,
  StatusBadge,
} from '@/components/common'
import { RevenueAreaChart } from '@/components/super-admin/charts/RevenueAreaChart'
import { PlanDonutChart } from '@/components/super-admin/charts/PlanDonutChart'
import { StatCard } from '@/components/common/StatCard'
import { ROUTES } from '@/config'
import { useDashboard } from '@/hooks/super-admin'
import { ApiException } from '@/lib/api/errors'
import type { SuperAdminGym, SuperAdminPlanMixName } from '@/types'

const planStyles: Record<SuperAdminPlanMixName, { label: string; fill: string }> = {
  FREE: { label: 'Free', fill: 'var(--color-chart-4)' },
  BASIC: { label: 'Basic', fill: 'var(--color-chart-1)' },
  PRO: { label: 'Pro', fill: 'var(--color-chart-2)' },
  NONE: { label: 'No plan', fill: 'var(--color-muted-foreground)' },
}

function currency(value: number, code = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code || 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function signedPercent(value: number | null) {
  if (value == null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

function titleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

function planLabel(gym: SuperAdminGym) {
  if (!gym.plan) return 'No plan'
  const name = titleCase(gym.plan)
  if (!gym.planInterval) return name
  return `${name} · ${gym.planInterval.toLowerCase()}`
}

function ownerName(gym: SuperAdminGym) {
  if (!gym.owner) return 'No owner'
  return `${gym.owner.firstName} ${gym.owner.lastName}`.trim()
}

function csvCell(value: string | number) {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function exportRecentGyms(rows: SuperAdminGym[]) {
  const header = ['Gym', 'Location', 'Owner', 'Plan', 'Members', 'Status']
  const lines = [
    header.join(','),
    ...rows.map((gym) =>
      [
        csvCell(gym.name),
        csvCell(gym.location),
        csvCell(ownerName(gym)),
        csvCell(planLabel(gym)),
        csvCell(gym.members),
        csvCell(titleCase(gym.status)),
      ].join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `platform-dashboard-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function trendFromPercent(value: number | null) {
  if (value == null) return undefined
  return {
    value: signedPercent(value),
    direction: (value < 0 ? 'down' : 'up') as 'up' | 'down',
  }
}

export default function SuperAdminDashboardPage() {
  const { dashboard, isLoading, error } = useDashboard()
  const summary = dashboard?.summary
  const code = summary?.currency ?? 'USD'
  const recentGyms = dashboard?.recentGyms ?? []
  const planMix = (dashboard?.planMix ?? []).map((item) => ({
    plan: planStyles[item.plan].label,
    gyms: item.gyms,
    fill: planStyles[item.plan].fill,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live gyms, members, and recurring revenue across the platform."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            disabled={!recentGyms.length}
            onClick={() => exportRecentGyms(recentGyms)}
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export report</span>
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner label="Loading dashboard…" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Could not load dashboard</p>
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
              label="Total gyms"
              value={(summary?.totalGyms ?? 0).toLocaleString()}
              icon={Building2}
              trend={trendFromPercent(summary?.gymGrowthPercent ?? null)}
              hint={
                summary?.gymGrowthPercent == null
                  ? `${summary?.gymsThisMonth ?? 0} joined this month`
                  : `${summary?.activeGyms ?? 0} active`
              }
            />
            <StatCard
              label="Active members"
              value={(summary?.activeMembers ?? 0).toLocaleString()}
              icon={Users}
              trend={trendFromPercent(summary?.memberGrowthPercent ?? null)}
              hint="across all gyms"
            />
            <StatCard
              label="Monthly revenue"
              value={currency(summary?.mrr ?? 0, code)}
              icon={DollarSign}
              hint="recurring revenue"
            />
            <StatCard
              label="Subscriptions"
              value={(summary?.activeSubscriptions ?? 0).toLocaleString()}
              icon={CreditCard}
              hint="active plans"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue overview</CardTitle>
                <CardDescription>
                  Monthly recurring revenue of current subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueAreaChart data={dashboard?.revenue ?? []} currency={code} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan distribution</CardTitle>
                <CardDescription>Gyms by subscription tier</CardDescription>
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

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle>Recent gyms</CardTitle>
                <CardDescription>Latest gyms onboarded to the platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href={ROUTES.SUPER_ADMIN_GYMS}>
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              {recentGyms.length === 0 ? (
                <EmptyState
                  icon={<Building2 className="h-8 w-8" />}
                  title="No gyms yet"
                  description="Gyms appear here after owners register on the platform."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-4 sm:pl-0">Gym</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead className="text-right">Members</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentGyms.map((gym) => (
                        <TableRow key={gym.id}>
                          <TableCell className="pl-4 sm:pl-0">
                            <div className="font-medium text-foreground">{gym.name}</div>
                            <div className="text-xs text-muted-foreground">{gym.location}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {ownerName(gym)}
                          </TableCell>
                          <TableCell>{planLabel(gym)}</TableCell>
                          <TableCell className="text-right font-mono">
                            {gym.members.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              status={gym.status}
                              label={titleCase(gym.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
