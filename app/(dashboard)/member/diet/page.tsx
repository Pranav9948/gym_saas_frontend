'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Salad, Sparkles } from 'lucide-react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import {
  DietPeriodLegend,
  DietPlanView,
} from '@/components/member/DietPlanView'
import { addDaysIso, localDateIso } from '@/components/staff/staff-ui'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { portalService, queryKeys } from '@/services'
import type { DietPlan } from '@/types'

function DietDayCard({
  title,
  subtitle,
  plan,
  empty,
  tone,
}: {
  title: string
  subtitle: string
  plan: DietPlan | null | undefined
  empty: string
  tone: 'tomorrow' | 'today' | 'past'
}) {
  const wrap =
    tone === 'tomorrow'
      ? 'border-emerald-400/50 bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-lime-400/10 shadow-lg shadow-emerald-500/10'
      : tone === 'today'
        ? 'border-sky-400/50 bg-gradient-to-br from-sky-400/20 via-cyan-400/10 to-blue-400/10 shadow-lg shadow-sky-500/10'
        : 'border-violet-400/30 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent'

  return (
    <section className={cn('overflow-hidden rounded-2xl border-2 p-4 sm:p-6', wrap)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider',
              tone === 'tomorrow' && 'text-emerald-700 dark:text-emerald-300',
              tone === 'today' && 'text-sky-700 dark:text-sky-300',
              tone === 'past' && 'text-violet-700 dark:text-violet-300',
            )}
          >
            {subtitle}
          </p>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-2xl shadow-md',
            tone === 'tomorrow' && 'bg-emerald-400 text-emerald-950 shadow-emerald-500/40',
            tone === 'today' && 'bg-sky-400 text-sky-950 shadow-sky-500/40',
            tone === 'past' && 'bg-violet-400 text-violet-950 shadow-violet-500/40',
          )}
        >
          {tone === 'past' ? (
            <CalendarDays className="size-5" />
          ) : (
            <Salad className="size-5" />
          )}
        </div>
      </div>
      {plan ? (
        <DietPlanView plan={plan} />
      ) : (
        <p className="rounded-xl border border-dashed border-white/15 bg-black/10 px-3 py-5 text-sm text-muted-foreground">
          {empty}
        </p>
      )}
    </section>
  )
}

export default function MemberDietPage() {
  const date = localDateIso()
  const tomorrow = addDaysIso(date, 1)
  const trainingQuery = useQuery({
    queryKey: queryKeys.portal.training(date),
    queryFn: () => portalService.getTraining(date),
  })
  const historyQuery = useQuery({
    queryKey: queryKeys.portal.history(),
    queryFn: () => portalService.getHistory(),
  })

  const training = trainingQuery.data?.data

  if (trainingQuery.isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <LoadingSpinner label="Loading your diet plan…" />
      </div>
    )
  }

  if (!training?.hasPersonalTraining) {
    return (
      <EmptyState
        title="Diet plans need personal training"
        description="Ask the front desk about a package that includes a trainer and diet plan."
      />
    )
  }

  if (!training.hasDietPlan) {
    return (
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-sky-400/15 p-5 sm:p-6">
          <h1 className="text-2xl font-bold tracking-tight">Your meals</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Meals appear when your package includes a customized diet plan.
          </p>
        </div>
        <Card>
          <CardContent className="px-4 pt-5 text-sm text-muted-foreground sm:px-6">
            Your current package does not include a diet plan.
          </CardContent>
        </Card>
      </div>
    )
  }

  const pastDiets = (historyQuery.data?.data.diets ?? []).filter(
    (plan) => plan.id !== training.tomorrowDiet?.id && plan.id !== training.todayDiet?.id,
  )

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border-2 border-emerald-400/45 bg-gradient-to-br from-emerald-400/25 via-teal-400/15 to-sky-400/20 p-5 shadow-lg shadow-emerald-500/10 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-500/40">
            <Salad className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your meals</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Breakfast through dinner, color-coded so each sitting is easy to
              scan.
            </p>
          </div>
        </div>
        <DietPeriodLegend className="mt-4" />
      </div>

      {training.dietNotification ? (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-400/45 bg-gradient-to-r from-emerald-400/30 via-teal-400/20 to-sky-400/20 px-4 py-4 shadow-lg shadow-emerald-500/10 sm:px-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-500/40">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-bold text-emerald-950 dark:text-emerald-100">
              {training.dietNotification.message}
            </p>
            <p className="text-sm text-muted-foreground">
              Scroll to tomorrow’s meals below.
            </p>
          </div>
        </div>
      ) : null}

      <DietDayCard
        title="Tomorrow"
        subtitle={tomorrow}
        plan={training.tomorrowDiet}
        empty="Your trainer has not published tomorrow’s diet plan yet."
        tone="tomorrow"
      />

      <DietDayCard
        title="Today"
        subtitle={date}
        plan={training.todayDiet}
        empty="No published diet plan for today."
        tone="today"
      />

      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Earlier plans</h2>
        {historyQuery.isLoading ? (
          <LoadingSpinner label="Loading history…" />
        ) : pastDiets.length === 0 ? (
          <p className="rounded-2xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
            No earlier diet plans yet.
          </p>
        ) : (
          pastDiets.map((plan) => (
            <DietDayCard
              key={plan.id}
              title={plan.date.slice(0, 10)}
              subtitle="Past plan"
              plan={plan}
              empty=""
              tone="past"
            />
          ))
        )}
      </section>
    </div>
  )
}
