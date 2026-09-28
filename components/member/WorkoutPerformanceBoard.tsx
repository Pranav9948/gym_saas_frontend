'use client'

import React from 'react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import { addDaysIso, localDateIso } from '@/components/staff/staff-ui'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
  MUSCLE_GROUP_THEMES,
  SUGGESTED_EXERCISES,
} from '@/constants/muscle-groups'
import { cn } from '@/lib/utils'
import type {
  MuscleGroup,
  WorkoutLogCatalog,
  WorkoutPerformance,
  WorkoutPerformanceEntry,
} from '@/types'

function startOfWeekMonday(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const weekday = date.getDay()
  date.setDate(date.getDate() + (weekday === 0 ? -6 : 1 - weekday))
  return localDateIso(date)
}

export function weekLabel(dateIso: string, todayIso = localDateIso()) {
  const thisWeek = startOfWeekMonday(todayIso)
  const lastWeek = addDaysIso(thisWeek, -7)
  const sessionWeek = startOfWeekMonday(dateIso)
  if (sessionWeek === thisWeek) return 'This Week'
  if (sessionWeek === lastWeek) return 'Last Week'
  return `${sessionWeek} – ${addDaysIso(sessionWeek, 6)}`
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function SetTable({ entry }: { entry: WorkoutPerformanceEntry }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-background/80">
      <div className="grid grid-cols-3 gap-2 border-b px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span>Set</span>
        <span>Reps</span>
        <span>Weight</span>
      </div>
      {entry.sets.map((set) => (
        <div
          key={set.id ?? `${entry.sessionId}-${set.setNumber}`}
          className="grid grid-cols-3 gap-2 px-3 py-2 text-sm"
        >
          <span className="font-semibold">{set.setNumber}</span>
          <span>{set.reps}</span>
          <span>{set.weight} kg</span>
        </div>
      ))}
    </div>
  )
}

export function WorkoutFilters({
  muscleGroup,
  exercise,
  catalog,
  extraExercises,
  onMuscleGroupChange,
  onExerciseChange,
}: {
  muscleGroup: MuscleGroup | ''
  exercise: string
  catalog?: WorkoutLogCatalog
  extraExercises?: string[]
  onMuscleGroupChange: (value: MuscleGroup | '') => void
  onExerciseChange: (value: string) => void
}) {
  const suggestions = muscleGroup
    ? [
        ...new Set([
          ...SUGGESTED_EXERCISES[muscleGroup],
          ...(catalog?.exercises
            .filter((item) => item.muscleGroup === muscleGroup)
            .map((item) => item.name) ?? []),
          ...(extraExercises ?? []),
        ]),
      ]
    : []

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Target muscle</Label>
        <Select
          value={muscleGroup || undefined}
          onValueChange={(value) => {
            onMuscleGroupChange(value as MuscleGroup)
            onExerciseChange('')
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a muscle group" />
          </SelectTrigger>
          <SelectContent>
            {MUSCLE_GROUPS.map((group) => (
              <SelectItem key={group} value={group}>
                {MUSCLE_GROUP_LABELS[group]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Workout / exercise</Label>
        {suggestions.length ? (
          <Select
            value={exercise || undefined}
            onValueChange={onExerciseChange}
            disabled={!muscleGroup}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              {suggestions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={exercise}
            onChange={(event) => onExerciseChange(event.target.value)}
            placeholder={muscleGroup ? 'Type an exercise name' : 'Pick a muscle first'}
            disabled={!muscleGroup}
          />
        )}
      </div>
    </div>
  )
}

export function WorkoutPerformanceBoard({
  muscleGroup,
  exercise,
  catalog,
  extraExercises,
  performance,
  isLoading,
  isError,
  emptyLabel = 'No logged sets for this exercise yet.',
  latestTitle = 'Latest performance',
  onMuscleGroupChange,
  onExerciseChange,
}: {
  muscleGroup: MuscleGroup | ''
  exercise: string
  catalog?: WorkoutLogCatalog
  extraExercises?: string[]
  performance?: WorkoutPerformance
  isLoading?: boolean
  isError?: boolean
  emptyLabel?: string
  latestTitle?: string
  onMuscleGroupChange: (value: MuscleGroup | '') => void
  onExerciseChange: (value: string) => void
}) {
  const groups = React.useMemo(() => {
    const history = (performance?.history ?? []).slice(1)
    const buckets = new Map<string, WorkoutPerformanceEntry[]>()
    for (const entry of history) {
      const label = weekLabel(entry.date)
      const current = buckets.get(label) ?? []
      current.push(entry)
      buckets.set(label, current)
    }
    return Array.from(buckets.entries())
  }, [performance?.history])

  const theme = muscleGroup ? MUSCLE_GROUP_THEMES[muscleGroup] : null
  const ready = Boolean(muscleGroup && exercise.trim().length >= 2)

  return (
    <div className="space-y-4">
      <WorkoutFilters
        muscleGroup={muscleGroup}
        exercise={exercise}
        catalog={catalog}
        extraExercises={extraExercises}
        onMuscleGroupChange={onMuscleGroupChange}
        onExerciseChange={onExerciseChange}
      />

      {!ready ? (
        <p className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
          Select a muscle group and exercise to see previous sets.
        </p>
      ) : isLoading ? (
        <LoadingSpinner label="Loading performance…" />
      ) : isError ? (
        <EmptyState
          title="Could not load history"
          description="Refresh the page and try this exercise again."
        />
      ) : !performance?.latest ? (
        <EmptyState title="No history yet" description={emptyLabel} />
      ) : (
        <div className="space-y-4">
          <section
            className={cn(
              'space-y-3 rounded-2xl border-2 p-4 sm:p-5',
              theme?.wrap,
            )}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {latestTitle}
              </p>
              <h3 className="text-lg font-bold">
                {MUSCLE_GROUP_LABELS[performance.muscleGroup]} · {performance.exercise}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(performance.latest.date)} · {weekLabel(performance.latest.date)}
              </p>
            </div>
            <SetTable entry={performance.latest} />
          </section>

          {groups.map(([label, entries]) => (
            <section key={label} className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {label}
              </h4>
              {entries.map((entry) => (
                <div
                  key={`${entry.sessionId}-${entry.createdAt}`}
                  className="space-y-2 rounded-2xl border p-3 sm:p-4"
                >
                  <p className="text-sm font-semibold">{formatDate(entry.date)}</p>
                  <ul className="space-y-1 text-sm">
                    {entry.sets.map((set) => (
                      <li key={set.id ?? `${entry.sessionId}-${set.setNumber}`}>
                        Set {set.setNumber}: {set.reps} reps × {set.weight} kg
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
