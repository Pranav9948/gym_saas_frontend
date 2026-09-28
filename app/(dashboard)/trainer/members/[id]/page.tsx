'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity, ArrowLeft, ClipboardCheck, Dumbbell, History, Salad, Users } from 'lucide-react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import { StaffModeCards, StaffPageHeader, addDaysIso, localDateIso } from '@/components/staff/staff-ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ROUTES } from '@/config'
import { DietPlanForm } from '@/components/trainer/DietPlanForm'
import { ProgressHistory } from '@/components/trainer/ProgressHistory'
import { TrainerWorkoutPerformance } from '@/components/trainer/TrainerWorkoutPerformance'
import { WorkoutForm } from '@/components/trainer/WorkoutForm'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import {
  dietsService,
  goalsService,
  membersService,
  queryKeys,
  workoutsService,
} from '@/services'
import type { WorkoutSession } from '@/types'
import type { PrimaryGoal, WeeklyTarget } from '@/types'

const PRIMARY_GOALS: Array<{ value: PrimaryGoal; label: string }> = [
  { value: 'FAT_LOSS', label: 'Fat loss' },
  { value: 'WEIGHT_GAIN', label: 'Weight gain' },
  { value: 'MUSCLE_GAIN', label: 'Muscle gain' },
  { value: 'STRENGTH', label: 'Strength improvement' },
  { value: 'ENDURANCE', label: 'Endurance / fitness improvement' },
  { value: 'RECOMPOSITION', label: 'Body recomposition' },
  { value: 'GENERAL_FITNESS', label: 'General fitness' },
  { value: 'OTHER', label: 'Other' },
]

type Mode = 'goal' | 'workout' | 'review' | 'diet' | 'performance' | 'history'

function sessionDateIso(value?: string | null) {
  if (!value) return ''
  const match = value.match(/\d{4}-\d{2}-\d{2}/)
  return match?.[0] ?? value.slice(0, 10)
}

function isWorkoutTracked(session?: WorkoutSession | null) {
  if (!session?.exercises?.length) return false
  return session.exercises.some((exercise) =>
    exercise.sets.some(
      (set) => set.actualReps != null || set.actualWeight != null,
    ),
  )
}

export default function TrainerMemberCoachPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const memberId = params.id
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const requestedMode = searchParams.get('tab')
  const [mode, setMode] = React.useState<Mode>(
    requestedMode === 'performance' ? 'performance' : 'goal',
  )

  const memberQuery = useQuery({
    queryKey: queryKeys.members.detail(memberId),
    queryFn: () => membersService.getMember(memberId),
  })

  const goalsQuery = useQuery({
    queryKey: queryKeys.goals.byMember(memberId),
    queryFn: () => goalsService.getMemberGoals(memberId),
  })

  const member = memberQuery.data?.data
  const features = member?.membershipPackage?.features ?? []
  const hasPt = features.includes('personal_training')
  const hasDietPlan = features.includes('customized_diet_plan')
  const activeGoal = (goalsQuery.data?.data ?? []).find((goal) => goal.isActive)
  const today = localDateIso()
  const tomorrow = addDaysIso(today, 1)

  const todayWorkoutQuery = useQuery({
    queryKey: queryKeys.workouts.byMember(memberId, today),
    queryFn: () => workoutsService.list(memberId, today),
    enabled: hasPt,
  })
  const todayDietQuery = useQuery({
    queryKey: queryKeys.diets.byMember(memberId, today),
    queryFn: () => dietsService.list(memberId, today),
    enabled: hasPt && hasDietPlan,
  })
  const tomorrowDietQuery = useQuery({
    queryKey: queryKeys.diets.byMember(memberId, tomorrow),
    queryFn: () => dietsService.list(memberId, tomorrow),
    enabled: hasPt && hasDietPlan,
  })

  const todayWorkout = todayWorkoutQuery.data?.data?.[0]
  const workoutSaved = Boolean(todayWorkout?.exercises?.length)
  const workoutTracked = isWorkoutTracked(todayWorkout)
  const dietDoneToday = Boolean(
    todayDietQuery.data?.data?.[0]?.publishedAt ||
      tomorrowDietQuery.data?.data?.[0]?.publishedAt,
  )

  if (memberQuery.isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <LoadingSpinner label="Loading member…" />
      </div>
    )
  }

  if (!member) {
    return (
      <EmptyState
        title="Member not found"
        description="This member may not be assigned to you."
      />
    )
  }

  return (
    <div className="space-y-5">
      <Link
        href={ROUTES.TRAINER_MEMBERS}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All assigned members
      </Link>

      <StaffPageHeader
        title={`${member.firstName} ${member.lastName}`}
        description={
          member.membershipPackage?.name
            ? `${member.membershipPackage.name} · goal, workout, review, then tomorrow’s diet`
            : 'Assign a personal-training package before coaching'
        }
      />

      {!hasPt ? (
        <Card>
          <CardContent className="px-4 pt-5 text-sm text-muted-foreground sm:px-6">
            Personal training tools open when this member is on a package that
            includes personal training.
          </CardContent>
        </Card>
      ) : (
        <>
          <StaffModeCards
            value={mode}
            onChange={setMode}
            options={[
              {
                value: 'goal',
                kicker: 'Step 1',
                title: 'Goal and progress',
                description: 'Set the target and weekly plan first.',
                icon: Users,
                accent: 'sky',
              },
              {
                value: 'workout',
                kicker: 'Step 2',
                title: 'Daily workout',
                description: hasDietPlan
                  ? "Build today's session with sets and reps."
                  : 'Needs a package with a customized diet plan.',
                icon: Dumbbell,
                accent: 'amber',
                done: workoutSaved,
                doneLabel: workoutTracked
                  ? "Today's workout is tracked."
                  : "Today's workout plan is saved.",
              },
              {
                value: 'review',
                kicker: 'Step 3',
                title: 'Performance review',
                description: 'See how today compared with the target.',
                icon: ClipboardCheck,
                accent: 'violet',
                done: Boolean(todayWorkout?.score != null),
                doneLabel: `Today scored ${todayWorkout?.score}/100.`,
              },
              {
                value: 'diet',
                kicker: 'Step 4',
                title: "Next day's diet",
                description: hasDietPlan
                  ? 'Prepare tomorrow’s meals and publish them.'
                  : 'Needs a package with a customized diet plan.',
                icon: Salad,
                accent: 'emerald',
                done: dietDoneToday,
                doneLabel: "Today's diet work is published.",
              },
              {
                value: 'performance',
                kicker: 'Past lifts',
                title: 'Previous performance',
                description: 'Look up what they lifted last time on an exercise.',
                icon: Activity,
                accent: 'rose',
              },
              {
                value: 'history',
                kicker: 'Log',
                title: 'Progress history',
                description: 'Workouts, scores, weight, and diet over time.',
                icon: History,
                accent: 'primary',
              },
            ]}
          />

          {mode === 'goal' ? (
            <GoalForm
              memberId={memberId}
              activeGoal={activeGoal}
              onSaved={() => {
                void queryClient.invalidateQueries({
                  queryKey: queryKeys.goals.byMember(memberId),
                })
                toast({ title: 'Goal saved', description: 'Weekly targets are ready to adjust.' })
              }}
            />
          ) : null}

          {mode === 'workout' ? (
            hasDietPlan ? (
              <WorkoutForm memberId={memberId} hasGoal={Boolean(activeGoal)} />
            ) : (
              <Card>
                <CardContent className="px-4 pt-5 text-sm text-muted-foreground sm:px-6">
                  Daily workout plans unlock when the member package includes a
                  customized diet plan.
                </CardContent>
              </Card>
            )
          ) : null}

          {mode === 'review' ? <ReviewPanel memberId={memberId} /> : null}

          {mode === 'diet' ? (
            hasDietPlan ? (
              <DietPlanForm memberId={memberId} hasGoal={Boolean(activeGoal)} />
            ) : (
              <Card className="border-2 border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 to-teal-400/5">
                <CardContent className="px-4 pt-5 text-sm text-muted-foreground sm:px-6">
                  Daily diet plans unlock when the member package includes a
                  customized diet plan.
                </CardContent>
              </Card>
            )
          ) : null}

          {mode === 'performance' ? (
            <TrainerWorkoutPerformance memberId={memberId} />
          ) : null}

          {mode === 'history' ? <ProgressHistory memberId={memberId} /> : null}
        </>
      )}
    </div>
  )
}

function GoalForm({
  memberId,
  activeGoal,
  onSaved,
}: {
  memberId: string
  activeGoal?: {
    primaryGoal?: PrimaryGoal
    currentWeight: number
    targetWeight: number
    durationWeeks: number
    targetDate?: string | null
    notes?: string | null
    weeklyTargets?: WeeklyTarget[]
  }
  onSaved: () => void
}) {
  const { toast } = useToast()
  const [primaryGoal, setPrimaryGoal] = React.useState<PrimaryGoal>(
    activeGoal?.primaryGoal ?? 'FAT_LOSS',
  )
  const [currentWeight, setCurrentWeight] = React.useState(
    String(activeGoal?.currentWeight ?? ''),
  )
  const [targetWeight, setTargetWeight] = React.useState(
    String(activeGoal?.targetWeight ?? ''),
  )
  const [weeks, setWeeks] = React.useState(String(activeGoal?.durationWeeks ?? 6))
  const [targetDate, setTargetDate] = React.useState(
    activeGoal?.targetDate?.slice(0, 10) ?? '',
  )
  const [notes, setNotes] = React.useState(activeGoal?.notes ?? '')
  const [targets, setTargets] = React.useState<WeeklyTarget[]>(
    activeGoal?.weeklyTargets ?? [],
  )

  React.useEffect(() => {
    if (!activeGoal) return
    setPrimaryGoal(activeGoal.primaryGoal ?? 'FAT_LOSS')
    setCurrentWeight(String(activeGoal.currentWeight))
    setTargetWeight(String(activeGoal.targetWeight))
    setWeeks(String(activeGoal.durationWeeks))
    setTargetDate(activeGoal.targetDate?.slice(0, 10) ?? '')
    setNotes(activeGoal.notes ?? '')
    setTargets(activeGoal.weeklyTargets ?? [])
  }, [activeGoal])

  const saveGoal = useMutation({
    mutationFn: () =>
      goalsService.createGoal(memberId, {
        primaryGoal,
        currentWeight: Number(currentWeight),
        targetWeight: Number(targetWeight),
        durationWeeks: Number(weeks) || undefined,
        targetDate: targetDate || undefined,
        notes: notes || undefined,
      }),
    onSuccess: (response) => {
      setTargets(response.data.weeklyTargets ?? [])
      onSaved()
    },
    onError: (error) => {
      toast({
        title: 'Could not save goal',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Check the numbers and try again.',
        variant: 'destructive',
      })
    },
  })

  const saveTargets = useMutation({
    mutationFn: () => goalsService.updateTargets(memberId, targets),
    onSuccess: onSaved,
    onError: (error) => {
      toast({
        title: 'Could not update weekly targets',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  return (
    <Card>
      <CardContent className="space-y-4 px-4 pt-5 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Primary goal</Label>
            <Select value={primaryGoal} onValueChange={(value) => setPrimaryGoal(value as PrimaryGoal)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIMARY_GOALS.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Current weight (kg)</Label>
            <Input
              type="number"
              value={currentWeight}
              onChange={(event) => setCurrentWeight(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Target weight (kg)</Label>
            <Input
              type="number"
              value={targetWeight}
              onChange={(event) => setTargetWeight(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (weeks)</Label>
            <Input type="number" value={weeks} onChange={(event) => setWeeks(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Target date</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Other fitness notes</Label>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Injuries, schedule, preferred training days…"
            />
          </div>
        </div>
        <Button disabled={saveGoal.isPending} onClick={() => saveGoal.mutate()}>
          {saveGoal.isPending ? 'Saving…' : 'Save goal and build weekly targets'}
        </Button>

        {targets.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold">Weekly targets</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Week</th>
                    <th className="pb-2 font-medium">Change (kg)</th>
                    <th className="pb-2 font-medium">Target weight</th>
                  </tr>
                </thead>
                <tbody>
                  {targets.map((row, index) => (
                    <tr key={row.week}>
                      <td className="py-1.5">Week {row.week}</td>
                      <td className="py-1.5">
                        <Input
                          type="number"
                          value={row.targetChangeKg}
                          onChange={(event) => {
                            const next = [...targets]
                            next[index] = {
                              ...row,
                              targetChangeKg: Number(event.target.value),
                            }
                            setTargets(next)
                          }}
                        />
                      </td>
                      <td className="py-1.5">
                        <Input
                          type="number"
                          value={row.targetWeightKg}
                          onChange={(event) => {
                            const next = [...targets]
                            next[index] = {
                              ...row,
                              targetWeightKg: Number(event.target.value),
                            }
                            setTargets(next)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              disabled={saveTargets.isPending}
              onClick={() => saveTargets.mutate()}
            >
              Save adjusted targets
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ReviewPanel({ memberId }: { memberId: string }) {
  const date = localDateIso()
  const sessionsQuery = useQuery({
    queryKey: queryKeys.workouts.byMember(memberId, date),
    queryFn: () => workoutsService.list(memberId, date),
  })

  const session = sessionsQuery.data?.data?.[0]
  const review = session?.review
  const tracked = isWorkoutTracked(session)

  if (sessionsQuery.isLoading) {
    return <LoadingSpinner label="Loading today’s performance…" />
  }

  if (!session?.exercises?.length) {
    return (
      <Card>
        <CardContent className="space-y-2 px-4 pt-5 sm:px-6">
          <h2 className="font-semibold">Today’s performance</h2>
          <p className="text-sm text-muted-foreground">
            Save today’s workout in Daily workout first. After you enter the
            reps and weight they actually did, the score appears here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-violet-500/25">
      <div className="border-b border-violet-500/20 bg-violet-500/10 px-4 py-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
          Today · {sessionDateIso(session.date) || date}
        </p>
        <h2 className="text-xl font-semibold">
          {review
            ? `Today’s score: ${review.score} out of 100`
            : 'Today’s workout is planned'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {tracked
            ? 'This compares the target you set with the reps and weight they completed.'
            : 'Enter completed reps and weight on Daily workout to generate a score.'}
        </p>
        {review?.scoreDelta != null ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {review.scoreDelta >= 0 ? '+' : ''}
            {review.scoreDelta} versus the last scored session
          </p>
        ) : null}
      </div>
      <CardContent className="space-y-4 px-4 pt-5 sm:px-6">
        {review ? (
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Reps vs target</dt>
              <dd className="font-medium">{review.repetitionCompletion}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Weight vs target</dt>
              <dd className="font-medium">{review.weightProgression}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sets completed</dt>
              <dd className="font-medium">{review.setCompletion}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Consistency</dt>
              <dd className="font-medium">{review.consistency}</dd>
            </div>
          </dl>
        ) : null}

        <div className="space-y-3">
          <h3 className="font-semibold">Target vs completed</h3>
          {session.exercises.map((exercise) => (
            <div key={exercise.id ?? exercise.name} className="rounded-xl border p-3">
              <p className="font-medium">
                {exercise.name}
                {review?.exerciseBreakdown.find((item) => item.name === exercise.name)
                  ? ` · ${review.exerciseBreakdown.find((item) => item.name === exercise.name)?.score}/100`
                  : ''}
              </p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[22rem] text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pb-1 font-medium">Set</th>
                      <th className="pb-1 font-medium">Target</th>
                      <th className="pb-1 font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set) => (
                      <tr key={`${exercise.name}-${set.setNumber}`}>
                        <td className="py-1">{set.setNumber}</td>
                        <td className="py-1">
                          {set.targetReps} reps at {set.targetWeight} kg
                        </td>
                        <td className="py-1">
                          {set.actualReps != null || set.actualWeight != null
                            ? `${set.actualReps ?? '—'} reps at ${set.actualWeight ?? '—'} kg`
                            : 'Not logged yet'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {review?.suggestion ? (
          <p className="rounded-lg bg-muted/50 p-3 text-sm">{review.suggestion}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
