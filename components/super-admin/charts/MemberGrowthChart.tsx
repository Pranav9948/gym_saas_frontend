'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { memberGrowth } from '@/lib/super-admin-mock'

const chartConfig = {
  members: {
    label: 'Members',
    color: 'var(--color-chart-2)',
  },
} satisfies ChartConfig

export function MemberGrowthChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <LineChart data={memberGrowth} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          width={44}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent formatter={(value) => Number(value).toLocaleString()} />
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
