'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { WorkoutPerformanceBoard } from '@/components/member/WorkoutPerformanceBoard'
import { SUGGESTED_EXERCISES } from '@/constants/muscle-groups'
import { queryKeys, workoutLogsService, workoutsService } from '@/services'
import type {
  LastWorkoutPerformance,
  MuscleGroup,
  WorkoutLogCatalog,
  WorkoutPerformance,
  WorkoutPerformanceEntry,
  WorkoutSession,
} from '@/types'

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function namesMatch(left: string, right: string) {
  const compactLeft = normalizeName(left)
  const compactRight = normalizeName(right)
  return Boolean(compactLeft) && compactLeft === compactRight
}

function sessionDateIso(value?: string | null) {
  if (!value) return ''
  const match = value.match(/\d{4}-\d{2}-\d{2}/)
  return match?.[0] ?? value.slice(0, 10)
}

function inferMuscleGroup(name: string): MuscleGroup | null {
  const compact = normalizeName(name)
  for (const [group, items] of Object.entries(SUGGESTED_EXERCISES) as Array<
    [MuscleGroup, string[]]
  >) {
    if (items.some((item) => normalizeName(item) === compact)) {
      return group
    }
  }
  return null
}

function entriesFromSessions(
  sessions: WorkoutSession[],
  muscleGroup: MuscleGroup,
  exercise: string,
): WorkoutPerformanceEntry[] {
  const entries: WorkoutPerformanceEntry[] = []
  for (const session of sessions) {
    for (const item of session.exercises ?? []) {
      if (!namesMatch(item.name, exercise)) continue
      const inferred = inferMuscleGroup(item.name)
      if (inferred && inferred !== muscleGroup) continue
      const sets = (item.sets ?? [])
        .map((set) => ({
          id: set.id,
          setNumber: set.setNumber,
          reps: set.actualReps ?? set.targetReps,
          weight: set.actualWeight ?? set.targetWeight,
        }))
        .filter((set) => set.reps != null && set.weight != null)
      if (!sets.length) continue
      entries.push({
        sessionId: session.id,
        date: sessionDateIso(session.date),
        createdAt: session.date,
        muscleGroup: inferred ?? muscleGroup,
        name: item.name,
        sets,
      })
    }
  }
  return entries
}

function entryFromLastPerformance(
  last: LastWorkoutPerformance | undefined,
  muscleGroup: MuscleGroup,
  exercise: string,
): WorkoutPerformanceEntry | null {
  const match = last?.exercises.find((item) => namesMatch(item.name, exercise))
  if (!match?.sets.length) return null
  const inferred = inferMuscleGroup(match.name)
  if (inferred && inferred !== muscleGroup) return null
  return {
    sessionId: `last-${match.date}-${match.name}`,
    date: match.date,
    createdAt: match.date,
    muscleGroup: inferred ?? muscleGroup,
    name: match.name,
    sets: match.sets.map((set) => ({
      setNumber: set.setNumber,
      reps: set.reps,
      weight: set.weight,
    })),
  }
}

function mergeHistory(entries: WorkoutPerformanceEntry[]) {
  const seen = new Set<string>()
  const history: WorkoutPerformanceEntry[] = []
  for (const entry of entries) {
    const key = `${entry.date}-${normalizeName(entry.name)}-${entry.sets
      .map((set) => `${set.setNumber}:${set.reps}:${set.weight}`)
      .join('|')}`
    if (seen.has(key)) continue
    seen.add(key)
    history.push(entry)
  }
  history.sort((left, right) => {
    if (left.date !== right.date) return right.date.localeCompare(left.date)
    return right.createdAt.localeCompare(left.createdAt)
  })
  return history
}

function mergePerformance({
  api,
  sessions,
  last,
  muscleGroup,
  exercise,
}: {
  api?: WorkoutPerformance
  sessions: WorkoutSession[]
  last?: LastWorkoutPerformance
  muscleGroup: MuscleGroup
  exercise: string
}): WorkoutPerformance {
  const lastEntry = entryFromLastPerformance(last, muscleGroup, exercise)
  const history = mergeHistory([
    ...(api?.history ?? []),
    ...entriesFromSessions(sessions, muscleGroup, exercise),
    ...(lastEntry ? [lastEntry] : []),
  ])

  return {
    muscleGroup,
    exercise: history[0]?.name ?? api?.exercise ?? exercise,
    latest: history[0] ?? null,
    history,
  }
}

function extraNamesForGroup(
  last: LastWorkoutPerformance | undefined,
  sessions: WorkoutSession[],
  muscleGroup: MuscleGroup,
) {
  const names = new Set<string>()
  for (const item of last?.exercises ?? []) {
    const inferred = inferMuscleGroup(item.name)
    if (!inferred || inferred === muscleGroup) names.add(item.name)
  }
  for (const session of sessions) {
    for (const item of session.exercises ?? []) {
      const inferred = inferMuscleGroup(item.name)
      if (!inferred || inferred === muscleGroup) names.add(item.name)
    }
  }
  return [...names]
}

function allTrackedNames(
  last: LastWorkoutPerformance | undefined,
  sessions: WorkoutSession[],
) {
  return [
    ...new Set([
      ...(last?.exercises.map((item) => item.name) ?? []),
      ...sessions.flatMap(
        (session) => session.exercises?.map((item) => item.name) ?? [],
      ),
    ]),
  ].filter((name) => name.trim().length >= 2)
}

function mergeCatalog(
  catalog: WorkoutLogCatalog | undefined,
  last: LastWorkoutPerformance | undefined,
  sessions: WorkoutSession[],
): WorkoutLogCatalog | undefined {
  const exercises = [...(catalog?.exercises ?? [])]
  for (const name of allTrackedNames(last, sessions)) {
    const muscleGroup = inferMuscleGroup(name) ?? 'OTHER'
    if (
      !exercises.some(
        (item) =>
          item.muscleGroup === muscleGroup && namesMatch(item.name, name),
      )
    ) {
      exercises.push({ muscleGroup, name })
    }
  }
  if (!catalog && !exercises.length) return catalog
  return {
    muscleGroups: [...new Set(exercises.map((item) => item.muscleGroup))],
    exercises,
  }
}

export function TrainerWorkoutPerformance({ memberId }: { memberId: string }) {
  const [muscleGroup, setMuscleGroup] = React.useState<MuscleGroup | ''>('')
  const [exercise, setExercise] = React.useState('')

  const catalogQuery = useQuery({
    queryKey: queryKeys.workoutLogs.catalog(memberId),
    queryFn: () => workoutLogsService.catalog(memberId),
  })

  const sessionsQuery = useQuery({
    queryKey: queryKeys.workouts.byMember(memberId),
    queryFn: () => workoutsService.list(memberId),
  })

  const lastQuery = useQuery({
    queryKey: queryKeys.workouts.lastPerformance(memberId),
    queryFn: () => workoutsService.lastPerformance(memberId),
  })

  const performanceQuery = useQuery({
    queryKey: queryKeys.workoutLogs.performance(
      memberId,
      muscleGroup || undefined,
      exercise,
    ),
    queryFn: () => workoutLogsService.performance(memberId, muscleGroup, exercise),
    enabled: Boolean(muscleGroup && exercise.trim().length >= 2),
  })

  const sessions = sessionsQuery.data?.data ?? []
  const last = lastQuery.data?.data
  const catalog = mergeCatalog(catalogQuery.data?.data, last, sessions)
  const extraExercises = muscleGroup
    ? extraNamesForGroup(last, sessions, muscleGroup)
    : []

  const performance =
    muscleGroup && exercise.trim().length >= 2
      ? mergePerformance({
          api: performanceQuery.data?.data,
          sessions,
          last,
          muscleGroup,
          exercise,
        })
      : undefined

  const isLoading =
    performanceQuery.isFetching ||
    sessionsQuery.isLoading ||
    lastQuery.isLoading

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border-2 border-rose-400/40 bg-gradient-to-br from-rose-400/20 via-orange-400/10 to-amber-400/10 p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
          Previous performance
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight">
          What did they lift last time?
        </h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Choose a muscle group, then an exercise. This includes workouts you
          tracked and any sets the member logged themselves.
        </p>
      </div>

      <WorkoutPerformanceBoard
        muscleGroup={muscleGroup}
        exercise={exercise}
        catalog={catalog}
        extraExercises={extraExercises}
        performance={performance}
        isLoading={isLoading}
        isError={
          performanceQuery.isError &&
          sessionsQuery.isError &&
          lastQuery.isError
        }
        latestTitle="Latest recorded session"
        emptyLabel="No tracked or logged sets for this exercise yet."
        onMuscleGroupChange={setMuscleGroup}
        onExerciseChange={setExercise}
      />
    </div>
  )
}
