'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { SuperAdminBillingMonth } from '@/types'

const chartConfig = {
  revenue: {
    label: 'Monthly equivalent',
    color: 'var(--color-chart-1)',
  },
} satisfies ChartConfig

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatAxis(value: number, currency: string) {
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return formatMoney(value, currency)
}

export function BillingBarChart({
  data,
  currency = 'USD',
}: {
  data: SuperAdminBillingMonth[]
  currency?: string
}) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          width={56}
          tickFormatter={(value) => formatAxis(Number(value), currency)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => formatMoney(Number(value), currency)}
            />
          }
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ChartContainer>
  )
}
