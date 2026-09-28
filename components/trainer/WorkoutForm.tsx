'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, Plus, Search, Trash2 } from 'lucide-react'
import { localDateIso } from '@/components/staff/staff-ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { cn } from '@/lib/utils'
import { queryKeys, workoutsService } from '@/services'
import type { LastWorkoutExercise, WorkoutSessionExercise } from '@/types/api'

type DraftSet = {
  setNumber: number
  targetReps: number | ''
  targetWeight: number | ''
  actualReps: number | null
  actualWeight: number | null
  notes?: string | null
}

type DraftExercise = {
  draftId: string
  id?: string
  name: string
  notes?: string | null
  sets: DraftSet[]
}

function newDraftId() {
  return `ex-${Math.random().toString(36).slice(2, 10)}`
}

function emptySet(setNumber: number): DraftSet {
  return {
    setNumber,
    targetReps: '',
    targetWeight: '',
    actualReps: null,
    actualWeight: null,
  }
}

function emptyExercise(): DraftExercise {
  return {
    draftId: newDraftId(),
    name: '',
    sets: [emptySet(1), emptySet(2), emptySet(3)],
  }
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function lastExerciseFor(
  exercises: LastWorkoutExercise[] | undefined,
  name: string,
) {
  const key = name.trim().toLowerCase()
  const compact = normalizeName(name)
  if (!key) return undefined
  return (
    exercises?.find((item) => item.name.trim().toLowerCase() === key) ??
    exercises?.find((item) => normalizeName(item.name) === compact)
  )
}

function lastSetFor(exercise: LastWorkoutExercise | undefined, setNumber: number) {
  return exercise?.sets.find((set) => set.setNumber === setNumber)
}

function formatLastDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function filterPreviousWorkouts(items: LastWorkoutExercise[], query: string) {
  const q = query.trim().toLowerCase()
  const compact = normalizeName(query)
  const matches = !q
    ? items
    : items.filter((item) => {
        const name = item.name.toLowerCase()
        return (
          name.includes(q) ||
          normalizeName(item.name).includes(compact) ||
          name.split(/\s+/).some((word) => word.startsWith(q))
        )
      })
  return [...matches].sort((a, b) => a.name.localeCompare(b.name))
}

function withDraftIds(exercises: WorkoutSessionExercise[]): DraftExercise[] {
  return exercises.map((exercise) => ({
    ...exercise,
    draftId: exercise.id ?? newDraftId(),
    sets: exercise.sets.map((set, index) => ({
      ...set,
      setNumber: set.setNumber || index + 1,
      targetReps: set.targetReps,
      targetWeight: set.targetWeight,
    })),
  }))
}

function parseOptionalNumber(value: string): number | '' {
  if (value === '') return ''
  const next = Number(value)
  return Number.isFinite(next) ? next : ''
}

function parseOptionalNullable(value: string): number | null {
  if (value === '') return null
  const next = Number(value)
  return Number.isFinite(next) ? next : null
}

function ExerciseNameSearch({
  id,
  value,
  previous,
  isLoading,
  onChange,
}: {
  id: string
  value: string
  previous: LastWorkoutExercise[]
  isLoading?: boolean
  onChange: (name: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const matches = filterPreviousWorkouts(previous, value)
  const query = value.trim()
  const showList = open && (query.length > 0 || previous.length > 0)

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div ref={wrapRef} className="relative space-y-2">
      <Label htmlFor={id}>Search this member’s previous exercises</Label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={value}
          autoComplete="off"
          placeholder="Start typing, e.g. B for Bench Press"
          className="pl-9"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
          }}
        />
      </div>

      {showList ? (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border bg-popover shadow-lg">
          {isLoading ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              Looking up previous workouts…
            </p>
          ) : matches.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              {previous.length === 0
                ? 'No previous workouts found for this member.'
                : `No previous workout found for “${query}”.`}
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto py-1">
              {matches.map((item) => {
                const first = item.sets[0]
                return (
                  <li key={`${item.name}-${item.date}`}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left hover:bg-accent',
                        normalizeName(value) === normalizeName(item.name) &&
                          'bg-amber-400/15',
                      )}
                      onClick={() => {
                        onChange(item.name)
                        setOpen(false)
                      }}
                    >
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Last session {formatLastDate(item.date)}
                        {first
                          ? ` · set 1 was ${first.reps} reps at ${first.weight} kg`
                          : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Matching previous workouts appear as you type. Pick one, or keep typing a
        new exercise name.
      </p>
    </div>
  )
}

export function WorkoutForm({
  memberId,
  hasGoal,
}: {
  memberId: string
  hasGoal: boolean
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [date, setDate] = React.useState(localDateIso)
  const [notes, setNotes] = React.useState('')
  const [exercises, setExercises] = React.useState<DraftExercise[]>([
    emptyExercise(),
  ])
  const loadedSessionKey = React.useRef<string | null>(null)

  const sessionsQuery = useQuery({
    queryKey: queryKeys.workouts.byMember(memberId, date),
    queryFn: () => workoutsService.list(memberId, date),
    enabled: hasGoal,
  })

  const lastPerformanceQuery = useQuery({
    queryKey: queryKeys.workouts.lastPerformance(memberId, date),
    queryFn: () => workoutsService.lastPerformance(memberId, date),
    enabled: hasGoal,
  })

  const previousWorkouts = lastPerformanceQuery.data?.data.exercises ?? []

  React.useEffect(() => {
    loadedSessionKey.current = null
  }, [date, memberId])

  React.useEffect(() => {
    if (!sessionsQuery.isFetched) return
    const existing = sessionsQuery.data?.data?.[0]
    const sessionKey = existing?.id ?? `new:${date}`
    if (loadedSessionKey.current === sessionKey) return
    loadedSessionKey.current = sessionKey
    if (!existing) {
      setNotes('')
      setExercises([emptyExercise()])
      return
    }
    setNotes(existing.notes ?? '')
    setExercises(
      existing.exercises.length ? withDraftIds(existing.exercises) : [emptyExercise()],
    )
  }, [sessionsQuery.isFetched, sessionsQuery.data, date])

  const updateExercise = (
    exerciseIndex: number,
    updater: (exercise: DraftExercise) => DraftExercise,
  ) => {
    setExercises((current) =>
      current.map((exercise, index) =>
        index === exerciseIndex ? updater(exercise) : exercise,
      ),
    )
  }

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    patch: Partial<DraftSet>,
  ) => {
    updateExercise(exerciseIndex, (exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set, index) =>
        index === setIndex ? { ...set, ...patch } : set,
      ),
    }))
  }

  const applyLastToSet = (
    exerciseIndex: number,
    setIndex: number,
    last: { reps: number; weight: number },
  ) => {
    updateSet(exerciseIndex, setIndex, {
      targetReps: last.reps,
      targetWeight: last.weight,
    })
  }

  const save = useMutation({
    mutationFn: () => {
      const planned = exercises
        .filter((exercise) => exercise.name.trim().length >= 2)
        .map((exercise) => {
          const lastExercise = lastExerciseFor(previousWorkouts, exercise.name)
          return {
            name: exercise.name.trim(),
            notes: exercise.notes?.trim() || undefined,
            sets: exercise.sets.map((set, setIndex) => {
              const lastSet = lastSetFor(lastExercise, setIndex + 1)
              const targetReps =
                set.targetReps === '' ? (lastSet?.reps ?? 0) : Number(set.targetReps)
              const targetWeight =
                set.targetWeight === ''
                  ? (lastSet?.weight ?? 0)
                  : Number(set.targetWeight)
              return {
                setNumber: setIndex + 1,
                targetReps,
                targetWeight,
                actualReps: set.actualReps,
                actualWeight: set.actualWeight,
                notes: set.notes?.trim() || undefined,
              }
            }),
          }
        })

      if (!planned.length) {
        throw new Error('Add at least one named exercise.')
      }
      if (
        planned.some((exercise) =>
          exercise.sets.some((set) => set.targetReps < 1),
        )
      ) {
        throw new Error(
          'Enter today’s target reps for each set, or copy the last recorded set.',
        )
      }

      return workoutsService.save(memberId, {
        date,
        notes: notes || undefined,
        exercises: planned,
      })
    },
    onSuccess: (response) => {
      loadedSessionKey.current = response.data.id
      void queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all })
      toast({
        title: 'Workout saved',
        description: 'Targets are set. Completed reps and weight can be filled after the session.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not save workout',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : error instanceof Error
              ? error.message
              : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  if (!hasGoal) {
    return (
      <Card>
        <CardContent className="px-4 pt-5 text-sm text-muted-foreground sm:px-6">
          Save a member goal first. The workout plan follows that target.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-5 px-4 pt-5 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold">Today’s workout plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search a previous exercise, read what they lifted last time, then
            type today’s target reps and weight for each set.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workout-date">Workout date</Label>
            <Input
              id="workout-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workout-notes">Session notes (optional)</Label>
            <Input
              id="workout-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Warm-up, focus, or rest notes"
            />
          </div>
        </div>

        {exercises.map((exercise, exerciseIndex) => {
          const lastExercise = lastExerciseFor(previousWorkouts, exercise.name)
          const named = exercise.name.trim().length >= 2

          return (
            <section
              key={exercise.draftId}
              className="space-y-4 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4"
            >
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <ExerciseNameSearch
                    id={`exercise-name-${exercise.draftId}`}
                    value={exercise.name}
                    previous={previousWorkouts}
                    isLoading={lastPerformanceQuery.isLoading}
                    onChange={(name) =>
                      updateExercise(exerciseIndex, (current) => ({
                        ...current,
                        name,
                      }))
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-7 shrink-0"
                  onClick={() =>
                    setExercises((current) =>
                      current.filter((_, index) => index !== exerciseIndex),
                    )
                  }
                  aria-label="Remove exercise"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {named && lastExercise ? (
                <p className="rounded-xl bg-amber-400/15 px-3 py-2 text-sm">
                  Last recorded <span className="font-semibold">{lastExercise.name}</span>{' '}
                  session was {formatLastDate(lastExercise.date)}.
                </p>
              ) : named ? (
                <p className="rounded-xl border border-dashed px-3 py-2 text-sm text-muted-foreground">
                  No previous workout found for “{exercise.name.trim()}”. You can
                  still set today’s targets.
                </p>
              ) : null}

              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => {
                  const lastSet = lastSetFor(lastExercise, setIndex + 1)
                  return (
                    <div
                      key={`${exercise.draftId}-set-${setIndex}`}
                      className="space-y-3 rounded-xl border bg-background p-3 sm:p-4"
                    >
                      <p className="text-sm font-bold">Set {setIndex + 1}</p>

                      <div className="rounded-lg border border-amber-400/35 bg-amber-400/10 px-3 py-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                          Last recorded performance
                        </p>
                        {lastSet ? (
                          <p className="mt-1 text-sm font-semibold">
                            {lastSet.reps} reps at {lastSet.weight} kg
                            {lastExercise?.date
                              ? ` on ${formatLastDate(lastExercise.date)}`
                              : ''}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {!named
                              ? 'Search an exercise to load the last set.'
                              : lastExercise
                                ? `No last record for set ${setIndex + 1}.`
                                : 'No previous workout found for this exercise.'}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <div className="space-y-1.5">
                          <Label htmlFor={`${exercise.draftId}-target-reps-${setIndex}`}>
                            Today’s target reps
                          </Label>
                          <Input
                            id={`${exercise.draftId}-target-reps-${setIndex}`}
                            type="number"
                            min={0}
                            inputMode="numeric"
                            placeholder={lastSet ? String(lastSet.reps) : 'e.g. 10'}
                            value={set.targetReps}
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                targetReps: parseOptionalNumber(event.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`${exercise.draftId}-target-weight-${setIndex}`}>
                            Today’s target weight (kg)
                          </Label>
                          <Input
                            id={`${exercise.draftId}-target-weight-${setIndex}`}
                            type="number"
                            min={0}
                            step="0.5"
                            inputMode="decimal"
                            placeholder={lastSet ? String(lastSet.weight) : 'e.g. 12'}
                            value={set.targetWeight}
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                targetWeight: parseOptionalNumber(event.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            disabled={!lastSet}
                            onClick={() => {
                              if (!lastSet) return
                              applyLastToSet(exerciseIndex, setIndex, lastSet)
                            }}
                          >
                            <Copy className="size-3.5" />
                            Copy last set
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor={`${exercise.draftId}-done-reps-${setIndex}`}>
                            Reps completed today (optional)
                          </Label>
                          <Input
                            id={`${exercise.draftId}-done-reps-${setIndex}`}
                            type="number"
                            min={0}
                            inputMode="numeric"
                            placeholder="Fill after the set"
                            value={set.actualReps ?? ''}
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                actualReps: parseOptionalNullable(event.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`${exercise.draftId}-done-weight-${setIndex}`}>
                            Weight used today, kg (optional)
                          </Label>
                          <Input
                            id={`${exercise.draftId}-done-weight-${setIndex}`}
                            type="number"
                            min={0}
                            step="0.5"
                            inputMode="decimal"
                            placeholder="Fill after the set"
                            value={set.actualWeight ?? ''}
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                actualWeight: parseOptionalNullable(
                                  event.target.value,
                                ),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateExercise(exerciseIndex, (current) => ({
                      ...current,
                      sets: [...current.sets, emptySet(current.sets.length + 1)],
                    }))
                  }
                >
                  Add another set
                </Button>
                {lastExercise ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      updateExercise(exerciseIndex, (current) => ({
                        ...current,
                        sets: current.sets.map((set, index) => {
                          const lastSet = lastSetFor(lastExercise, index + 1)
                          if (!lastSet) return set
                          return {
                            ...set,
                            targetReps: lastSet.reps,
                            targetWeight: lastSet.weight,
                          }
                        }),
                      }))
                    }
                  >
                    <Copy className="size-3.5" />
                    Copy every last set into today’s targets
                  </Button>
                ) : null}
              </div>
            </section>
          )
        })}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setExercises((current) => [...current, emptyExercise()])}
          >
            <Plus className="size-4" />
            Add another exercise
          </Button>
          <Button
            disabled={
              save.isPending ||
              exercises.every((exercise) => exercise.name.trim().length < 2)
            }
            onClick={() => save.mutate()}
          >
            {save.isPending ? 'Saving…' : 'Save today’s workout'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
