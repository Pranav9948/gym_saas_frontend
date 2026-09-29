'use client'

import React from 'react'
import { AlertCircle, Clock, IndianRupee, Wallet } from 'lucide-react'
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
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { BillingBarChart } from '@/components/super-admin/charts/BillingBarChart'
import { StatCard } from '@/components/common/StatCard'
import { useSuperAdminDashboard } from '@/hooks/super-admin'
import { formatInr } from '@/lib/money'

const statusStyles: Record<string, string> = {
  paid: 'bg-primary/15 text-primary',
  pending: 'bg-chart-4/15 text-chart-4',
  overdue: 'bg-destructive/15 text-destructive',
}

export default function SuperAdminBillingPage() {
  const { data, isLoading, isError, refetch } = useSuperAdminDashboard()
  const dashboard = data?.data

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (isError || !dashboard) {
    return (
      <EmptyState
        title="Unable to load billing"
        description="Could not load subscription billing from the database."
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    )
  }

  const monthLabel = new Date().toLocaleString('en-IN', { month: 'short' })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Collections and invoices from live gym subscriptions."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={`Collected (${monthLabel})`}
          value={formatInr(dashboard.billing.collectedThisMonth, 'INR')}
          icon={IndianRupee}
          hint="active monthly value"
        />
        <StatCard
          label="Outstanding"
          value={formatInr(dashboard.billing.outstanding, 'INR')}
          icon={Clock}
          hint="incomplete checkouts"
        />
        <StatCard
          label="Overdue"
          value={formatInr(dashboard.billing.overdue, 'INR')}
          icon={AlertCircle}
          hint="past due subscriptions"
        />
        <StatCard
          label="Renewing (30 days)"
          value={formatInr(dashboard.billing.nextPayout, 'INR')}
          icon={Wallet}
          hint="coming due"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>New subscription value by month (INR)</CardDescription>
        </CardHeader>
        <CardContent>
          <BillingBarChart data={dashboard.revenueTrend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent invoices</CardTitle>
          <CardDescription>Latest subscription billing from your gyms</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {dashboard.invoices.length === 0 ? (
            <EmptyState title="No invoices yet" description="Subscriptions will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4 sm:pl-0">Invoice</TableHead>
                    <TableHead>Gym</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="pl-4 font-mono text-sm sm:pl-0">{invoice.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{invoice.gym}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.plan}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invoice.issuedAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatInr(invoice.amount, 'INR')}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium capitalize ${statusStyles[invoice.status]}`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {invoice.status}
                        </span>
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
