'use client'

import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { localDateIso } from '@/components/staff/staff-ui'
import { Button } from '@/components/ui/button'
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
import type { MemberWorkoutExercise, MuscleGroup, WorkoutLogCatalog } from '@/types'

type DraftSet = { draftId: string; setNumber: number; reps: string; weight: string }
type DraftExercise = {
  draftId: string
  muscleGroup: MuscleGroup
  name: string
  sets: DraftSet[]
}

function newId() {
  return `row-${Math.random().toString(36).slice(2, 10)}`
}

function emptySet(setNumber: number): DraftSet {
  return { draftId: newId(), setNumber, reps: '', weight: '' }
}

function emptyExercise(): DraftExercise {
  return {
    draftId: newId(),
    muscleGroup: 'CHEST',
    name: '',
    sets: [emptySet(1), emptySet(2), emptySet(3)],
  }
}

export function WorkoutLogForm({
  catalog,
  isSaving,
  onSave,
}: {
  catalog?: WorkoutLogCatalog
  isSaving?: boolean
  onSave: (payload: {
    date: string
    notes?: string
    exercises: MemberWorkoutExercise[]
  }) => void
}) {
  const [date, setDate] = React.useState(localDateIso())
  const [notes, setNotes] = React.useState('')
  const [exercises, setExercises] = React.useState<DraftExercise[]>([emptyExercise()])

  const catalogNames = (muscleGroup: MuscleGroup) => {
    const logged =
      catalog?.exercises
        .filter((item) => item.muscleGroup === muscleGroup)
        .map((item) => item.name) ?? []
    return [...new Set([...SUGGESTED_EXERCISES[muscleGroup], ...logged])]
  }

  const updateExercise = (draftId: string, patch: Partial<DraftExercise>) => {
    setExercises((current) =>
      current.map((item) => (item.draftId === draftId ? { ...item, ...patch } : item)),
    )
  }

  const updateSet = (exerciseId: string, setId: string, patch: Partial<DraftSet>) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.draftId === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.draftId === setId ? { ...set, ...patch } : set,
              ),
            }
          : exercise,
      ),
    )
  }

  const handleSave = () => {
    const payload = exercises
      .map((exercise) => ({
        muscleGroup: exercise.muscleGroup,
        name: exercise.name.trim(),
        sets: exercise.sets
          .filter((set) => set.reps !== '' && set.weight !== '')
          .map((set, index) => ({
            setNumber: index + 1,
            reps: Number(set.reps),
            weight: Number(set.weight),
          })),
      }))
      .filter((exercise) => exercise.name.length >= 2 && exercise.sets.length)

    onSave({
      date,
      notes: notes.trim() || undefined,
      exercises: payload,
    })
  }

  return (
    <div className="space-y-4">
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
          <Label htmlFor="workout-notes">Notes (optional)</Label>
          <Input
            id="workout-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="How the session felt"
          />
        </div>
      </div>

      {exercises.map((exercise, exerciseIndex) => {
        const theme = MUSCLE_GROUP_THEMES[exercise.muscleGroup]
        const suggestions = catalogNames(exercise.muscleGroup)
        return (
          <section
            key={exercise.draftId}
            className={cn('space-y-3 rounded-2xl border-2 p-3 sm:p-4', theme.wrap)}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold">Exercise {exerciseIndex + 1}</p>
              {exercises.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setExercises((current) =>
                      current.filter((item) => item.draftId !== exercise.draftId),
                    )
                  }
                  aria-label="Remove exercise"
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Target muscle</Label>
                <Select
                  value={exercise.muscleGroup}
                  onValueChange={(value) =>
                    updateExercise(exercise.draftId, {
                      muscleGroup: value as MuscleGroup,
                    })
                  }
                >
                  <SelectTrigger className="bg-background/80">
                    <SelectValue />
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
                <Input
                  list={`exercises-${exercise.draftId}`}
                  value={exercise.name}
                  onChange={(event) =>
                    updateExercise(exercise.draftId, { name: event.target.value })
                  }
                  placeholder="e.g. Bench Press"
                  className="bg-background/80"
                />
                <datalist id={`exercises-${exercise.draftId}`}>
                  {suggestions.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-background/80">
              <div className="grid grid-cols-[3.5rem_1fr_1fr_2.5rem] gap-2 border-b px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Set</span>
                <span>Reps</span>
                <span>Weight kg</span>
                <span />
              </div>
              {exercise.sets.map((set) => (
                <div
                  key={set.draftId}
                  className="grid grid-cols-[3.5rem_1fr_1fr_2.5rem] items-center gap-2 px-3 py-2"
                >
                  <span className="text-sm font-semibold">{set.setNumber}</span>
                  <Input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={set.reps}
                    onChange={(event) =>
                      updateSet(exercise.draftId, set.draftId, {
                        reps: event.target.value,
                      })
                    }
                    placeholder="12"
                  />
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    inputMode="decimal"
                    value={set.weight}
                    onChange={(event) =>
                      updateSet(exercise.draftId, set.draftId, {
                        weight: event.target.value,
                      })
                    }
                    placeholder="8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    disabled={exercise.sets.length <= 1}
                    onClick={() =>
                      updateExercise(exercise.draftId, {
                        sets: exercise.sets
                          .filter((item) => item.draftId !== set.draftId)
                          .map((item, index) => ({ ...item, setNumber: index + 1 })),
                      })
                    }
                    aria-label="Remove set"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={theme.chip}
              onClick={() =>
                updateExercise(exercise.draftId, {
                  sets: [...exercise.sets, emptySet(exercise.sets.length + 1)],
                })
              }
            >
              <Plus className="size-4" />
              Add set
            </Button>
          </section>
        )
      })}

      <div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-2xl border-2 border-amber-400/35 bg-background/90 p-3 shadow-lg backdrop-blur">
        <Button
          type="button"
          variant="outline"
          onClick={() => setExercises((current) => [...current, emptyExercise()])}
        >
          <Plus className="size-4" />
          Add exercise
        </Button>
        <Button
          className="bg-amber-500 text-amber-950 hover:bg-amber-400"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving…' : 'Save workout'}
        </Button>
      </div>
    </div>
  )
}
