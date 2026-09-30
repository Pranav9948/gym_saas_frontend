'use client'

import React from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity, Dumbbell, Flag, NotebookPen, Salad, Target } from 'lucide-react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import { StaffPageHeader, localDateIso } from '@/components/staff/staff-ui'
import { TrainerPhoto } from '@/components/trainers/TrainerPhoto'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { portalService, queryKeys } from '@/services'
import { ROUTES } from '@/config'
import type { PrimaryGoal, WorkoutSessionExercise } from '@/types'

const PRIMARY_GOAL_LABELS: Record<PrimaryGoal, string> = {
  FAT_LOSS: 'Fat loss',
  WEIGHT_GAIN: 'Weight gain',
  MUSCLE_GAIN: 'Muscle gain',
  STRENGTH: 'Strength',
  ENDURANCE: 'Endurance',
  RECOMPOSITION: 'Body recomposition',
  GENERAL_FITNESS: 'General fitness',
  OTHER: 'Other',
}

type ActualDraft = Record<string, { actualReps: string; actualWeight: string }>

function draftsFromExercises(exercises: WorkoutSessionExercise[]): ActualDraft {
  const next: ActualDraft = {}
  for (const exercise of exercises) {
    for (const set of exercise.sets) {
      if (!set.id) continue
      next[set.id] = {
        actualReps: set.actualReps == null ? '' : String(set.actualReps),
        actualWeight: set.actualWeight == null ? '' : String(set.actualWeight),
      }
    }
  }
  return next
}

export default function MemberDashboardPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const date = localDateIso()
  const [drafts, setDrafts] = React.useState<ActualDraft>({})
  const loadedSessionId = React.useRef<string | null>(null)

  const trainingQuery = useQuery({
    queryKey: queryKeys.portal.training(date),
    queryFn: () => portalService.getTraining(date),
  })

  const training = trainingQuery.data?.data
  const session = training?.today
  const review = session?.review
  const progress = training?.weeklyProgress
  const goal = training?.goal
  const trainer = training?.member.assignedTrainer

  React.useEffect(() => {
    if (!session) {
      loadedSessionId.current = null
      setDrafts({})
      return
    }
    if (loadedSessionId.current === session.id) return
    loadedSessionId.current = session.id
    setDrafts(draftsFromExercises(session.exercises))
  }, [session])

  const saveActuals = useMutation({
    mutationFn: () =>
      portalService.logActuals({
        date,
        sets: Object.entries(drafts).map(([setId, value]) => ({
          setId,
          actualReps: value.actualReps === '' ? null : Number(value.actualReps),
          actualWeight:
            value.actualWeight === '' ? null : Number(value.actualWeight),
        })),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.portal.all })
      toast({
        title: 'Results saved',
        description: 'Your score and review update from the sets you logged.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not save results',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  if (trainingQuery.isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <LoadingSpinner label="Loading your training…" />
      </div>
    )
  }

  if (trainingQuery.isError || !training) {
    return (
      <EmptyState
        title="Could not load training"
        description="Ask the front desk to confirm your member portal login is linked."
      />
    )
  }

  if (!training.hasPersonalTraining) {
    return (
      <div className="space-y-5">
        <StaffPageHeader
          title={`Hi, ${training.user.firstName}`}
          description="You can still log your own workouts on this package."
        />
        <Link href={ROUTES.MEMBER_WORKOUTS} className="block">
          <Card className="border-2 border-amber-400/45 bg-gradient-to-r from-amber-400/25 via-orange-400/15 to-rose-400/15 shadow-lg shadow-amber-500/10 transition-colors hover:border-amber-400/70">
            <CardContent className="flex items-center gap-3 px-4 py-4 sm:px-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-md shadow-amber-500/40">
                <Activity className="size-5" />
              </div>
              <div>
                <p className="font-bold">Log today’s workout</p>
                <p className="text-sm text-muted-foreground">
                  Record muscle group, exercise, sets, reps, and weight. Compare
                  with last week any time.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardContent className="px-4 pt-5 text-sm text-muted-foreground sm:px-6">
            Your current package
            {training.member.membershipPackage?.name
              ? ` (${training.member.membershipPackage.name})`
              : ''}{' '}
            does not include personal training. Ask the front desk if you want a
            trainer assigned.
          </CardContent>
        </Card>
      </div>
    )
  }

  const loggedSetCount = Object.values(drafts).filter(
    (value) => value.actualReps !== '' || value.actualWeight !== '',
  ).length

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title={`Today’s training`}
        description={
          trainer
            ? `Coached by ${trainer.user.firstName} ${trainer.user.lastName}`
            : 'Your personal training dashboard'
        }
      />

      <Link href={ROUTES.MEMBER_WORKOUTS} className="block">
        <Card className="border-2 border-amber-400/40 bg-gradient-to-r from-amber-400/20 via-orange-400/10 to-transparent transition-colors hover:border-amber-400/60">
          <CardContent className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-amber-950">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Log your own workout</p>
              <p className="text-sm text-muted-foreground">
                Track extra sets by muscle and exercise, then compare weeks.
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>

      {training.dietNotification ? (
        <Link href={ROUTES.MEMBER_DIET} className="block">
          <Card className="border-2 border-emerald-400/45 bg-gradient-to-r from-emerald-400/30 via-teal-400/20 to-sky-400/20 shadow-lg shadow-emerald-500/10 transition-colors hover:border-emerald-400/70">
            <CardContent className="flex items-center gap-3 px-4 py-4 sm:px-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-500/40">
                <Salad className="size-5" />
              </div>
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-100">
                  {training.dietNotification.message}
                </p>
                <p className="text-sm text-muted-foreground">
                  Open your color-coded meals for {training.dietNotification.date}.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : null}

      {trainer ? (
        <Card>
          <CardContent className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <TrainerPhoto user={trainer.user} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {trainer.user.firstName} {trainer.user.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {trainer.specialization || 'Your assigned trainer'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 px-4 pt-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Flag className="size-4 text-sky-600 dark:text-sky-400" />
              Weekly goals
            </div>
            {progress && goal ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {PRIMARY_GOAL_LABELS[goal.primaryGoal ?? 'GENERAL_FITNESS']} · week{' '}
                  {progress.week} of {progress.durationWeeks}
                </p>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Starting weight</dt>
                    <dd className="font-medium">{progress.currentWeight} kg</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">This week</dt>
                    <dd className="font-medium">
                      {progress.thisWeekTargetKg != null
                        ? `${progress.thisWeekTargetKg} kg`
                        : '—'}
                    </dd>
                  </div>
                </dl>
                {goal.notes ? (
                  <p className="rounded-lg bg-muted/50 p-3 text-sm">{goal.notes}</p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your trainer has not set a goal yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 px-4 pt-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="size-4 text-violet-600 dark:text-violet-400" />
              Progress toward the final target
            </div>
            {progress ? (
              <>
                <p className="text-2xl font-semibold">{progress.percentToTarget}%</p>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${progress.percentToTarget}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Final target:{' '}
                  {progress.finalTargetKg != null ? `${progress.finalTargetKg} kg` : '—'}
                  {progress.targetDate
                    ? ` · by ${progress.targetDate.slice(0, 10)}`
                    : ''}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Overall progress appears after your trainer saves a target.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 px-4 pt-5 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Dumbbell className="size-4 text-amber-600 dark:text-amber-400" />
            Today’s workout
          </div>

          {!session ? (
            <p className="text-sm text-muted-foreground">
              Your trainer has not posted a workout for today yet.
            </p>
          ) : (
            <>
              {session.notes ? (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm">
                  <p className="mb-1 flex items-center gap-1.5 font-medium">
                    <NotebookPen className="size-3.5" />
                    Trainer’s notes
                  </p>
                  <p className="text-muted-foreground">{session.notes}</p>
                </div>
              ) : null}

              {session.exercises.map((exercise) => (
                <div
                  key={exercise.id ?? exercise.name}
                  className="space-y-3 rounded-xl border bg-muted/20 p-4"
                >
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    {exercise.notes ? (
                      <p className="text-xs text-muted-foreground">{exercise.notes}</p>
                    ) : null}
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[34rem] space-y-2">
                      <div className="grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr] gap-2 px-1 text-xs font-medium text-muted-foreground">
                        <span>Set</span>
                        <span>Target reps</span>
                        <span>Target weight (kg)</span>
                        <span>Reps completed</span>
                        <span>Weight used (kg)</span>
                      </div>
                      {exercise.sets.map((set) => (
                        <div
                          key={set.id ?? `${exercise.name}-${set.setNumber}`}
                          className="grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr] items-center gap-2"
                        >
                          <p className="rounded-md bg-background px-2 py-2 text-center text-sm font-medium">
                            {set.setNumber}
                          </p>
                          <p className="rounded-md bg-background px-3 py-2 text-sm">
                            {set.targetReps}
                          </p>
                          <p className="rounded-md bg-background px-3 py-2 text-sm">
                            {set.targetWeight}
                          </p>
                          {set.id ? (
                            <>
                              <Input
                                type="number"
                                min={0}
                                inputMode="numeric"
                                aria-label={`Set ${set.setNumber} reps completed`}
                                value={drafts[set.id]?.actualReps ?? ''}
                                onChange={(event) =>
                                  setDrafts((current) => ({
                                    ...current,
                                    [set.id!]: {
                                      actualReps: event.target.value,
                                      actualWeight:
                                        current[set.id!]?.actualWeight ?? '',
                                    },
                                  }))
                                }
                              />
                              <Input
                                type="number"
                                min={0}
                                step="0.5"
                                inputMode="decimal"
                                aria-label={`Set ${set.setNumber} weight used`}
                                value={drafts[set.id]?.actualWeight ?? ''}
                                onChange={(event) =>
                                  setDrafts((current) => ({
                                    ...current,
                                    [set.id!]: {
                                      actualReps:
                                        current[set.id!]?.actualReps ?? '',
                                      actualWeight: event.target.value,
                                    },
                                  }))
                                }
                              />
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">—</p>
                              <p className="text-sm text-muted-foreground">—</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                disabled={saveActuals.isPending || loggedSetCount === 0}
                onClick={() => saveActuals.mutate()}
              >
                {saveActuals.isPending ? 'Saving…' : 'Save today’s results'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-violet-500/25">
        <div className="border-b border-violet-500/20 bg-violet-500/10 px-4 py-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
            Today’s performance
          </p>
          <h2 className="text-xl font-semibold">
            {review ? `Score: ${review.score}/100` : 'Score pending'}
          </h2>
          {review?.scoreDelta != null ? (
            <p className="text-sm text-muted-foreground">
              {review.scoreDelta >= 0 ? '+' : ''}
              {review.scoreDelta} vs last scored session
            </p>
          ) : null}
        </div>
        <CardContent className="space-y-4 px-4 pt-5 sm:px-6">
          {!review ? (
            <p className="text-sm text-muted-foreground">
              Log completed reps or weights to generate today’s score and
              improvement notes.
            </p>
          ) : (
            <>
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">Reps</dt>
                  <dd className="font-medium">{review.repetitionCompletion}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Weight vs plan</dt>
                  <dd className="font-medium">{review.weightProgression}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sets</dt>
                  <dd className="font-medium">{review.setCompletion}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Consistency</dt>
                  <dd className="font-medium">{review.consistency}</dd>
                </div>
              </dl>
              {review.improvements.length ? (
                <div>
                  <h3 className="font-semibold">Needs improvement</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {review.exerciseBreakdown
                      .filter((item) => review.improvements.includes(item.name))
                      .map((item) => (
                        <li key={item.name} className="rounded-lg border p-3">
                          <p className="font-medium">
                            {item.name} · {item.score}/100
                          </p>
                          <p className="text-muted-foreground">{item.note}</p>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No weak spots flagged for this session.
                </p>
              )}
              <p className="rounded-lg bg-muted/50 p-3 text-sm">{review.suggestion}</p>
            </>
          )}
        </CardContent>
      </Card>

      <MemberProgressHistory />
    </div>
  )
}

function MemberProgressHistory() {
  const historyQuery = useQuery({
    queryKey: queryKeys.portal.history(),
    queryFn: () => portalService.getHistory(),
  })
  const history = historyQuery.data?.data
  if (historyQuery.isLoading || !history) return null
  const workouts = history.workouts.slice(0, 7)
  const weights = history.weights.slice(0, 7)
  if (workouts.length === 0 && weights.length === 0) return null

  return (
    <Card>
      <CardContent className="space-y-4 px-4 pt-5 sm:px-6">
        <h2 className="font-semibold">Recent progress</h2>
        {workouts.length ? (
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Workouts</p>
            <ul className="space-y-1 text-sm">
              {workouts.map((session) => (
                <li key={session.id} className="flex justify-between">
                  <span>{session.date.slice(0, 10)}</span>
                  <span className="font-medium">
                    {session.score != null ? `${session.score}/100` : 'Not scored'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {weights.length ? (
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Weight</p>
            <ul className="space-y-1 text-sm">
              {weights.map((entry) => (
                <li key={entry.id} className="flex justify-between">
                  <span>{entry.date.slice(0, 10)}</span>
                  <span className="font-medium">{entry.weight} kg</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
