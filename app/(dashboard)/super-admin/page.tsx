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
import { PageHeader, StatusBadge } from '@/components/common'
import { RevenueAreaChart } from '@/components/super-admin/charts/RevenueAreaChart'
import { PlanDonutChart } from '@/components/super-admin/charts/PlanDonutChart'
import { gyms, planDistribution, platformStats } from '@/lib/super-admin-mock'
import { StatCard } from '@/components/common/StatCard'
import { StatusType } from '@/types'

const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)





export default function SuperAdminDashboardPage() {
  const recentGyms = gyms.slice(0, 5)

  const statusMap: Record<
    "active" | "trial" | "suspended" | "pending",
    StatusType
  > = {
    active: "ACTIVE",
    trial: "PENDING",       // or ACTIVE/INACTIVE, whichever makes sense
    suspended: "BANNED",    // or INACTIVE
    pending: "PENDING",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor performance across every gym on your platform."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            <span className="hidden sm:inline">Export report</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Gyms"
          value={platformStats.totalGyms.toLocaleString()}
          icon={Building2}
          trend={{ value: '+12%', direction: 'up' }}
          hint="vs. last month"
        />
        <StatCard
          label="Active Members"
          value={platformStats.activeMembers.toLocaleString()}
          icon={Users}
          trend={{ value: '+8.2%', direction: 'up' }}
          hint="across all gyms"
        />
        <StatCard
          label="Monthly Revenue"
          value={currency(platformStats.monthlyRevenue)}
          icon={DollarSign}
          trend={{ value: '+5.4%', direction: 'up' }}
          hint="recurring revenue"
        />
        <StatCard
          label="Subscriptions"
          value={platformStats.activeSubscriptions.toLocaleString()}
          icon={CreditCard}
          trend={{ value: '-1.1%', direction: 'down' }}
          hint="active plans"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue overview</CardTitle>
            <CardDescription>Monthly recurring revenue over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan distribution</CardTitle>
            <CardDescription>Gyms by subscription tier</CardDescription>
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

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Recent gyms</CardTitle>
            <CardDescription>Latest gyms onboarded to the platform</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            asChild
          >
            <Link href="/super-admin/gyms">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
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
                      {gym.members.toLocaleString()}
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
        </CardContent>
      </Card>
    </div>
  )
}
