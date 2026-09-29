'use client'

import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const chartConfig = {
  gyms: { label: 'Gyms' },
  FREE: { label: 'FREE', color: 'var(--color-chart-1)' },
  BASIC: { label: 'BASIC', color: 'var(--color-chart-2)' },
  PRO: { label: 'PRO', color: 'var(--color-chart-4)' },
} satisfies ChartConfig

interface PlanDonutChartProps {
  data: Array<{ plan: string; gyms: number; fill: string }>
}

export function PlanDonutChart({ data }: PlanDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.gyms, 0)

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-56">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="gyms"
          nameKey="plan"
          innerRadius={62}
          outerRadius={92}
          strokeWidth={4}
          stroke="var(--card)"
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-mono text-2xl font-bold"
                    >
                      {total}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      Total gyms
                    </tspan>
                  </text>
                )
              }
              return null
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
