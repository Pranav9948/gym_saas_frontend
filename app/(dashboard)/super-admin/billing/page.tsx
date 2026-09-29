'use client'

import React from 'react'
import {
  AlertCircle,
  CalendarClock,
  CreditCard,
  DollarSign,
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
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { BillingBarChart } from '@/components/super-admin/charts/BillingBarChart'
import { StatCard } from '@/components/common/StatCard'
import { useBilling } from '@/hooks/super-admin'
import { ApiException } from '@/lib/api/errors'
import type { SuperAdminBillingStatus, SuperAdminBillingSubscription } from '@/types'

function currency(value: number, code = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code || 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function titleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

function planLabel(plan: string, interval: string) {
  return `${titleCase(plan)} · ${interval.toLowerCase()}`
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const statusStyles: Record<SuperAdminBillingStatus, string> = {
  active: 'bg-primary/15 text-primary',
  trial: 'bg-chart-2/15 text-chart-2',
  pending: 'bg-chart-4/15 text-chart-4',
  overdue: 'bg-destructive/15 text-destructive',
  canceled: 'bg-muted text-muted-foreground',
}

function csvCell(value: string | number) {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function exportSubscriptions(rows: SuperAdminBillingSubscription[]) {
  const header = [
    'Gym',
    'Plan',
    'Interval',
    'Amount',
    'Currency',
    'Status',
    'Period start',
    'Period end',
  ]
  const lines = [
    header.join(','),
    ...rows.map((row) =>
      [
        csvCell(row.gymName),
        csvCell(titleCase(row.plan)),
        csvCell(row.interval.toLowerCase()),
        csvCell(row.amount),
        csvCell(row.currency),
        csvCell(row.status),
        csvCell(row.currentPeriodStart ?? ''),
        csvCell(row.currentPeriodEnd ?? ''),
      ].join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `platform-billing-${stamp}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function SuperAdminBillingPage() {
  const { billing, isLoading, error } = useBilling()
  const summary = billing?.summary
  const code = summary?.currency ?? 'USD'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Live subscriptions, recurring revenue, and gym billing status across the platform."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            disabled={!billing?.subscriptions.length}
            onClick={() => {
              if (billing?.subscriptions.length) {
                exportSubscriptions(billing.subscriptions)
              }
            }}
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner label="Loading billing…" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Could not load billing</p>
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
              label="Monthly recurring"
              value={currency(summary?.mrr ?? 0, code)}
              icon={DollarSign}
              hint={`${summary?.activePaidCount ?? 0} paid gyms`}
            />
            <StatCard
              label="Outstanding"
              value={currency(summary?.outstanding ?? 0, code)}
              icon={CreditCard}
              hint="past due and incomplete"
            />
            <StatCard
              label="Overdue"
              value={currency(summary?.overdue ?? 0, code)}
              icon={AlertCircle}
              hint={`${summary?.overdueCount ?? 0} gyms`}
            />
            <StatCard
              label="Renewing this month"
              value={currency(summary?.renewingThisMonth ?? 0, code)}
              icon={CalendarClock}
              hint={`${summary?.renewingCount ?? 0} coming due`}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New recurring</CardTitle>
              <CardDescription>
                Monthly-equivalent value of subscriptions started in each of the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillingBarChart
                data={billing?.monthly ?? []}
                currency={code}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Current billing state for each gym</CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              {!billing?.subscriptions.length ? (
                <EmptyState
                  icon={<CreditCard className="h-8 w-8" />}
                  title="No subscriptions yet"
                  description="Gym subscriptions appear here after owners choose a plan."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-4 sm:pl-0">Gym</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billing.subscriptions.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="pl-4 font-medium text-foreground sm:pl-0">
                            {row.gymName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {planLabel(row.plan, row.interval)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(row.currentPeriodStart)} – {formatDate(row.currentPeriodEnd)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {currency(row.amount, row.currency)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium capitalize ${statusStyles[row.status]}`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />
                              {row.status === 'overdue' ? 'Past due' : row.status}
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
        </>
      )}
    </div>
  )
}
