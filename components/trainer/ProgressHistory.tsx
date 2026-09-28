'use client'

import { useQuery } from '@tanstack/react-query'
import { Salad } from 'lucide-react'
import { DietPlanView } from '@/components/member/DietPlanView'
import { LoadingSpinner } from '@/components/common'
import { Card, CardContent } from '@/components/ui/card'
import { dietsService, goalsService, queryKeys, workoutsService } from '@/services'

function dateLabel(value: string) {
  const iso = value.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? value.slice(0, 10)
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ProgressHistory({ memberId }: { memberId: string }) {
  const workoutsQuery = useQuery({
    queryKey: queryKeys.workouts.byMember(memberId),
    queryFn: () => workoutsService.list(memberId),
  })
  const dietsQuery = useQuery({
    queryKey: queryKeys.diets.byMember(memberId),
    queryFn: () => dietsService.list(memberId),
  })
  const goalsQuery = useQuery({
    queryKey: queryKeys.goals.byMember(memberId),
    queryFn: () => goalsService.getMemberGoals(memberId),
  })
  const weightsQuery = useQuery({
    queryKey: [...queryKeys.goals.byMember(memberId), 'weights'],
    queryFn: () => goalsService.listWeights(memberId),
  })

  if (
    workoutsQuery.isLoading ||
    dietsQuery.isLoading ||
    goalsQuery.isLoading ||
    weightsQuery.isLoading
  ) {
    return <LoadingSpinner label="Loading history…" />
  }

  const workouts = workoutsQuery.data?.data ?? []
  const diets = dietsQuery.data?.data ?? []
  const goals = goalsQuery.data?.data ?? []
  const weights = weightsQuery.data?.data ?? []

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 px-4 pt-5 sm:px-6">
          <h2 className="font-semibold">Goals</h2>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No goals saved yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {goals.map((goal) => (
                <li key={goal.id} className="rounded-lg border p-3">
                  <p className="font-medium">
                    {goal.currentWeight} kg → {goal.targetWeight} kg
                    {goal.isActive ? ' · active' : ''}
                  </p>
                  <p className="text-muted-foreground">
                    {goal.durationWeeks} weeks · started {dateLabel(goal.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 px-4 pt-5 sm:px-6">
          <h2 className="font-semibold">Weight log</h2>
          {weights.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Weight is recorded each time a goal is saved.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {weights.map((entry) => (
                <li key={entry.id} className="flex justify-between rounded-lg border px-3 py-2">
                  <span>{dateLabel(entry.date)}</span>
                  <span className="font-medium">{entry.weight} kg</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 px-4 pt-5 sm:px-6">
          <h2 className="font-semibold">Saved workout sessions</h2>
          <p className="text-sm text-muted-foreground">
            Each row is one training day. The score is how close completed sets
            were to the target you set.
          </p>
          {workouts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No workout sessions yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {workouts.map((session) => (
                <li key={session.id} className="rounded-lg border p-3">
                  <p className="font-medium">{dateLabel(session.date)}</p>
                  <p className="text-muted-foreground">
                    {session.score != null
                      ? `Score ${session.score} out of 100`
                      : 'Targets saved · completed sets not scored yet'}
                    {session.exercises?.length
                      ? ` · ${session.exercises.length} exercise${session.exercises.length === 1 ? '' : 's'}`
                      : ''}
                  </p>
                  {session.notes ? (
                    <p className="mt-1 text-muted-foreground">{session.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-sky-400/10 p-4 shadow-lg shadow-emerald-500/10 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-500/40">
            <Salad className="size-5" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Diet plans</h2>
        </div>
        {diets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No diet plans yet.</p>
        ) : (
          <div className="space-y-4">
            {diets.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border-2 border-emerald-400/25 bg-background/50 p-4"
              >
                <p className="mb-3 text-sm font-semibold">
                  {dateLabel(plan.date)}
                  {plan.publishedAt ? (
                    <span className="ml-2 rounded-full bg-emerald-400/25 px-2 py-0.5 text-[11px] font-bold text-emerald-950 dark:text-emerald-100">
                      published
                    </span>
                  ) : (
                    <span className="ml-2 rounded-full bg-amber-400/25 px-2 py-0.5 text-[11px] font-bold text-amber-950 dark:text-amber-100">
                      draft
                    </span>
                  )}
                </p>
                <DietPlanView plan={plan} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
