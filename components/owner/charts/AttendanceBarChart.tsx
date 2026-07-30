'use client'

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { attendanceTrend } from '@/lib/owner-mock'

const chartConfig = {
  checkins: {
    label: 'Check-ins',
    color: 'var(--color-chart-1)',
  },
} satisfies ChartConfig

export function AttendanceBarChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={attendanceTrend} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={32} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="checkins" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {attendanceTrend.map((entry) => (
            <Cell
              key={entry.day}
              fill={entry.today ? 'var(--color-chart-1)' : 'var(--color-muted-foreground)'}
              fillOpacity={entry.today ? 1 : 0.35}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
