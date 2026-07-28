'use client'

import React from 'react'
import { AlertCircle, Download, DollarSign, Clock, Wallet } from 'lucide-react'
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
import { PageHeader, } from '@/components/common'
import { BillingBarChart } from '@/components/super-admin/charts/BillingBarChart'
import { billingSummary, invoices } from '@/lib/super-admin-mock'
import { StatCard } from '@/components/common/StatCard'

const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const statusStyles: Record<string, string> = {
  paid: 'bg-primary/15 text-primary',
  pending: 'bg-chart-4/15 text-chart-4',
  overdue: 'bg-destructive/15 text-destructive',
}

export default function SuperAdminBillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Track collections, payouts, and invoices across the platform."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected (Dec)"
          value={currency(billingSummary.collectedThisMonth)}
          icon={DollarSign}
          trend={{ value: '+6.8%', direction: 'up' }}
        />
        <StatCard
          label="Outstanding"
          value={currency(billingSummary.outstanding)}
          icon={Clock}
          hint="awaiting payment"
        />
        <StatCard
          label="Overdue"
          value={currency(billingSummary.overdue)}
          icon={AlertCircle}
          trend={{ value: '+2 invoices', direction: 'down' }}
        />
        <StatCard
          label="Next Payout"
          value={currency(billingSummary.nextPayout)}
          icon={Wallet}
          hint="scheduled Jan 1"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>Monthly revenue collected over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <BillingBarChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent invoices</CardTitle>
          <CardDescription>Latest billing activity from your gyms</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
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
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="pl-4 font-mono text-sm sm:pl-0">{invoice.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{invoice.gym}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.plan}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.issuedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {currency(invoice.amount)}
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
        </CardContent>
      </Card>
    </div>
  )
}
