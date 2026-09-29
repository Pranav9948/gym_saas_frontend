'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatInr, formatInrCompact } from '@/lib/money'

const chartConfig = {
  revenue: {
    label: 'Collected',
    color: 'var(--color-chart-1)',
  },
} satisfies ChartConfig

interface BillingBarChartProps {
  data: Array<{ month: string; revenue: number }>
}

export function BillingBarChart({ data }: BillingBarChartProps) {
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
          width={52}
          tickFormatter={(value) => formatInrCompact(Number(value), 'INR')}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent formatter={(value) => formatInr(Number(value), 'INR')} />
          }
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ChartContainer>
  )
}
