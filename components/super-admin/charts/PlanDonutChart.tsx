'use client'

import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { planDistribution } from '@/lib/super-admin-mock'

const chartConfig = {
  gyms: { label: 'Gyms' },
  Starter: { label: 'Starter', color: 'var(--color-chart-1)' },
  Growth: { label: 'Growth', color: 'var(--color-chart-2)' },
  Enterprise: { label: 'Enterprise', color: 'var(--color-chart-4)' },
} satisfies ChartConfig

export function PlanDonutChart() {
  const total = planDistribution.reduce((sum, item) => sum + item.gyms, 0)

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-56">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={planDistribution}
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
