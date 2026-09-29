'use client'

import React from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  IndianRupee,
  CreditCard,
  ArrowRight,
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
import { EmptyState, LoadingSpinner, PageHeader, StatusBadge } from '@/components/common'
import { RevenueAreaChart } from '@/components/super-admin/charts/RevenueAreaChart'
import { PlanDonutChart } from '@/components/super-admin/charts/PlanDonutChart'
import { StatCard } from '@/components/common/StatCard'
import { StatusType } from '@/types'
import { useSuperAdminDashboard } from '@/hooks/super-admin'
import { formatInr } from '@/lib/money'
import type { SuperAdminGymStatus } from '@/types/super-admin-dashboard'

const statusMap: Record<SuperAdminGymStatus, StatusType> = {
  active: 'ACTIVE',
  trial: 'PENDING',
  suspended: 'BANNED',
  pending: 'PENDING',
}

export default function SuperAdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useSuperAdminDashboard()
  const dashboard = data?.data

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (isError || !dashboard) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description="Could not load live gym data. Try again."
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    )
  }

  const recentGyms = dashboard.gyms.slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live performance across every gym on your platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Gyms"
          value={dashboard.stats.totalGyms.toLocaleString('en-IN')}
          icon={Building2}
          hint="registered gyms"
        />
        <StatCard
          label="Active Members"
          value={dashboard.stats.activeMembers.toLocaleString('en-IN')}
          icon={Users}
          hint="across all gyms"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatInr(dashboard.stats.monthlyRevenue, 'INR')}
          icon={IndianRupee}
          hint="active subscriptions"
        />
        <StatCard
          label="Subscriptions"
          value={dashboard.stats.activeSubscriptions.toLocaleString('en-IN')}
          icon={CreditCard}
          hint="paid plans"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue overview</CardTitle>
            <CardDescription>New subscription value by month (INR)</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart data={dashboard.revenueTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan distribution</CardTitle>
            <CardDescription>Gyms by subscription tier</CardDescription>
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

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Recent gyms</CardTitle>
            <CardDescription>Latest gyms onboarded to the platform</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/super-admin/gyms">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {recentGyms.length === 0 ? (
            <EmptyState title="No gyms yet" description="Registered gyms will appear here." />
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
                      <TableCell className="text-muted-foreground">{gym.owner}</TableCell>
                      <TableCell>{gym.plan}</TableCell>
                      <TableCell className="text-right font-mono">
                        {gym.members.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={statusMap[gym.status]}
                          label={gym.status.charAt(0).toUpperCase() + gym.status.slice(1)}
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
    </div>
  )
}
