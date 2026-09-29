'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { SuperAdminMemberGrowthMonth } from '@/types'

const chartConfig = {
  members: {
    label: 'Members',
    color: 'var(--color-chart-2)',
  },
} satisfies ChartConfig

function formatAxis(value: number) {
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return String(Math.round(value))
}

export function MemberGrowthChart({ data }: { data: SuperAdminMemberGrowthMonth[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <LineChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          width={48}
          allowDecimals={false}
          tickFormatter={formatAxis}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent formatter={(value) => Number(value).toLocaleString('en-IN')} />
          }
        />
        <Line
          dataKey="members"
          type="monotone"
          stroke="var(--color-members)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--color-members)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
