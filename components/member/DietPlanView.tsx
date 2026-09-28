'use client'

import type { ReactNode } from 'react'
import { Moon, NotebookPen, Salad, Sun, Sunrise, Sunset } from 'lucide-react'
import type { DietPeriod, DietPlan, DietPlanMeal } from '@/types'
import { cn } from '@/lib/utils'

export const DIET_PERIOD_LABELS: Record<DietPeriod, string> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
  NIGHT: 'Night',
}

export const DIET_PERIODS: DietPeriod[] = [
  'MORNING',
  'AFTERNOON',
  'EVENING',
  'NIGHT',
]

export const DIET_PERIOD_THEMES: Record<
  DietPeriod,
  {
    label: string
    hint: string
    Icon: typeof Sun
    wrap: string
    bar: string
    body: string
    header: string
    icon: string
    chip: string
    accent: string
    add: string
  }
> = {
  MORNING: {
    label: 'Morning',
    hint: 'Breakfast',
    Icon: Sunrise,
    wrap: 'border-amber-400/60 shadow-amber-500/10',
    bar: 'bg-gradient-to-r from-amber-400/55 via-orange-400/35 to-yellow-400/15',
    body: 'bg-amber-500/12',
    header: 'text-amber-950 dark:text-amber-50',
    icon: 'bg-amber-400 text-amber-950 shadow-md shadow-amber-500/40',
    chip: 'bg-amber-400/30 text-amber-950 dark:text-amber-100',
    accent: 'border-l-amber-400',
    add: 'bg-amber-400/25 text-amber-950 hover:bg-amber-400/40 dark:text-amber-50',
  },
  AFTERNOON: {
    label: 'Afternoon',
    hint: 'Lunch',
    Icon: Sun,
    wrap: 'border-sky-400/60 shadow-sky-500/10',
    bar: 'bg-gradient-to-r from-sky-400/55 via-cyan-400/30 to-blue-400/15',
    body: 'bg-sky-500/12',
    header: 'text-sky-950 dark:text-sky-50',
    icon: 'bg-sky-400 text-sky-950 shadow-md shadow-sky-500/40',
    chip: 'bg-sky-400/30 text-sky-950 dark:text-sky-100',
    accent: 'border-l-sky-400',
    add: 'bg-sky-400/25 text-sky-950 hover:bg-sky-400/40 dark:text-sky-50',
  },
  EVENING: {
    label: 'Evening',
    hint: 'Snack',
    Icon: Sunset,
    wrap: 'border-violet-400/60 shadow-violet-500/10',
    bar: 'bg-gradient-to-r from-violet-400/55 via-fuchsia-400/30 to-pink-400/15',
    body: 'bg-violet-500/12',
    header: 'text-violet-950 dark:text-violet-50',
    icon: 'bg-violet-400 text-violet-950 shadow-md shadow-violet-500/40',
    chip: 'bg-violet-400/30 text-violet-950 dark:text-violet-100',
    accent: 'border-l-violet-400',
    add: 'bg-violet-400/25 text-violet-950 hover:bg-violet-400/40 dark:text-violet-50',
  },
  NIGHT: {
    label: 'Night',
    hint: 'Dinner',
    Icon: Moon,
    wrap: 'border-indigo-400/60 shadow-indigo-500/10',
    bar: 'bg-gradient-to-r from-indigo-400/55 via-blue-500/30 to-slate-400/15',
    body: 'bg-indigo-500/12',
    header: 'text-indigo-950 dark:text-indigo-50',
    icon: 'bg-indigo-400 text-indigo-950 shadow-md shadow-indigo-500/40',
    chip: 'bg-indigo-400/30 text-indigo-950 dark:text-indigo-100',
    accent: 'border-l-indigo-400',
    add: 'bg-indigo-400/25 text-indigo-950 hover:bg-indigo-400/40 dark:text-indigo-50',
  },
}

function mealsFor(plan: DietPlan, period: DietPeriod) {
  return plan.meals.filter((meal) => meal.period === period)
}

function formatMacro(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export function planMacroTotals(plan: DietPlan) {
  return plan.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories ?? 0),
      protein: acc.protein + (meal.protein ?? 0),
      carbs: acc.carbs + (meal.carbs ?? 0),
      fat: acc.fat + (meal.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}

function NutritionPills({ meal }: { meal: DietPlanMeal }) {
  const pills = [
    meal.calories != null
      ? {
          key: 'kcal',
          label: `${formatMacro(meal.calories)} kcal`,
          className:
            'bg-orange-400/25 text-orange-950 ring-1 ring-orange-400/40 dark:text-orange-100',
        }
      : null,
    meal.protein != null
      ? {
          key: 'p',
          label: `P ${formatMacro(meal.protein)}g`,
          className: 'bg-sky-400/25 text-sky-950 ring-1 ring-sky-400/40 dark:text-sky-100',
        }
      : null,
    meal.carbs != null
      ? {
          key: 'c',
          label: `C ${formatMacro(meal.carbs)}g`,
          className:
            'bg-amber-400/25 text-amber-950 ring-1 ring-amber-400/40 dark:text-amber-100',
        }
      : null,
    meal.fat != null
      ? {
          key: 'f',
          label: `F ${formatMacro(meal.fat)}g`,
          className: 'bg-rose-400/25 text-rose-950 ring-1 ring-rose-400/40 dark:text-rose-100',
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; className: string }>

  if (!pills.length) return null

  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {pills.map((pill) => (
        <span
          key={pill.key}
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            pill.className,
          )}
        >
          {pill.label}
        </span>
      ))}
    </div>
  )
}

export function DietPeriodLegend({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {DIET_PERIODS.map((period) => {
        const theme = DIET_PERIOD_THEMES[period]
        const Icon = theme.Icon
        return (
          <span
            key={period}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
              theme.chip,
            )}
          >
            <Icon className="size-3.5" />
            {theme.label}
          </span>
        )
      })}
    </div>
  )
}

export function DietMacroStrip({ plan }: { plan: DietPlan }) {
  const totals = planMacroTotals(plan)
  const hasMacros =
    totals.calories > 0 || totals.protein > 0 || totals.carbs > 0 || totals.fat > 0
  if (!hasMacros) return null

  const items = [
    {
      key: 'kcal',
      label: 'Calories',
      value: `${formatMacro(totals.calories)} kcal`,
      className: 'border-orange-400/40 bg-orange-400/20 text-orange-950 dark:text-orange-100',
    },
    {
      key: 'p',
      label: 'Protein',
      value: `${formatMacro(totals.protein)}g`,
      className: 'border-sky-400/40 bg-sky-400/20 text-sky-950 dark:text-sky-100',
    },
    {
      key: 'c',
      label: 'Carbs',
      value: `${formatMacro(totals.carbs)}g`,
      className: 'border-amber-400/40 bg-amber-400/20 text-amber-950 dark:text-amber-100',
    },
    {
      key: 'f',
      label: 'Fat',
      value: `${formatMacro(totals.fat)}g`,
      className: 'border-rose-400/40 bg-rose-400/20 text-rose-950 dark:text-rose-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.key}
          className={cn(
            'rounded-xl border px-3 py-2.5',
            item.className,
          )}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
            {item.label}
          </p>
          <p className="mt-0.5 text-sm font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function DietMealCard({
  meal,
  period,
}: {
  meal: DietPlanMeal
  period: DietPeriod
}) {
  const theme = DIET_PERIOD_THEMES[period]
  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-background/80 p-3.5 shadow-sm dark:bg-zinc-950/55',
        'border-l-4',
        theme.accent,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold capitalize leading-tight">{meal.name}</p>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            theme.chip,
          )}
        >
          {meal.quantity}
        </span>
      </div>
      <NutritionPills meal={meal} />
      {meal.notes ? (
        <p className="mt-2 text-xs text-muted-foreground">{meal.notes}</p>
      ) : null}
    </div>
  )
}

export function DietPeriodSection({
  period,
  meals,
  emptyLabel = 'No meals yet.',
  actions,
  children,
}: {
  period: DietPeriod
  meals?: DietPlanMeal[]
  emptyLabel?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  const theme = DIET_PERIOD_THEMES[period]
  const Icon = theme.Icon
  const count = meals?.length ?? 0

  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border-2 shadow-lg',
        theme.wrap,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-4 py-3',
          theme.bar,
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-11 items-center justify-center rounded-xl',
              theme.icon,
            )}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <h3 className={cn('text-base font-bold tracking-tight', theme.header)}>
              {theme.label}
            </h3>
            <p className="text-xs font-medium text-foreground/70">
              {theme.hint}
              {meals ? ` · ${count} meal${count === 1 ? '' : 's'}` : ''}
            </p>
          </div>
        </div>
        {actions}
      </div>
      <div className={cn('space-y-3 p-3 sm:p-4', theme.body)}>
        {children}
        {!children && meals ? (
          meals.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/15 bg-black/10 px-3 py-4 text-sm text-muted-foreground">
              {emptyLabel}
            </p>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {meals.map((meal, index) => (
                <DietMealCard
                  key={meal.id ?? `${period}-${index}`}
                  meal={meal}
                  period={period}
                />
              ))}
            </div>
          )
        ) : null}
      </div>
    </section>
  )
}

export function DietPlanView({
  plan,
  emptyLabel = 'No meals yet.',
}: {
  plan: DietPlan
  emptyLabel?: string
}) {
  return (
    <div className="space-y-4">
      <DietMacroStrip plan={plan} />

      {plan.notes ? (
        <div className="rounded-2xl border-2 border-emerald-400/45 bg-gradient-to-r from-emerald-400/30 via-teal-400/20 to-lime-400/10 p-4 shadow-lg shadow-emerald-500/10">
          <p className="mb-1 flex items-center gap-2 text-sm font-bold text-emerald-950 dark:text-emerald-100">
            <Salad className="size-4" />
            Trainer’s instructions
          </p>
          <p className="flex items-start gap-2 text-sm text-foreground">
            <NotebookPen className="mt-0.5 size-3.5 shrink-0 text-emerald-700 dark:text-emerald-300" />
            {plan.notes}
          </p>
        </div>
      ) : null}

      {DIET_PERIODS.map((period) => (
        <DietPeriodSection
          key={period}
          period={period}
          meals={mealsFor(plan, period)}
          emptyLabel={emptyLabel}
        />
      ))}
    </div>
  )
}
