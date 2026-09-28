'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Salad, Send, Trash2 } from 'lucide-react'
import {
  DIET_PERIODS,
  DIET_PERIOD_THEMES,
  DietPeriodLegend,
  DietPeriodSection,
  DietPlanView,
} from '@/components/member/DietPlanView'
import { addDaysIso, localDateIso } from '@/components/staff/staff-ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { cn } from '@/lib/utils'
import { dietsService, queryKeys } from '@/services'
import type { DietPeriod, DietPlanMeal } from '@/types'

type DraftMeal = DietPlanMeal & { draftId: string }

function newDraftId() {
  return `meal-${Math.random().toString(36).slice(2, 10)}`
}

function emptyMeal(period: DietPeriod): DraftMeal {
  return {
    draftId: newDraftId(),
    period,
    name: '',
    quantity: '',
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
  }
}

function defaultMeals(): DraftMeal[] {
  return DIET_PERIODS.map((period) => emptyMeal(period))
}

const NUTRIENT_FIELDS = [
  {
    key: 'calories' as const,
    label: 'Calories',
    className:
      'border-orange-400/50 bg-orange-400/10 focus-visible:ring-orange-400/40',
    labelClass: 'text-orange-800 dark:text-orange-200',
  },
  {
    key: 'protein' as const,
    label: 'Protein g',
    className: 'border-sky-400/50 bg-sky-400/10 focus-visible:ring-sky-400/40',
    labelClass: 'text-sky-800 dark:text-sky-200',
  },
  {
    key: 'carbs' as const,
    label: 'Carbs g',
    className:
      'border-amber-400/50 bg-amber-400/10 focus-visible:ring-amber-400/40',
    labelClass: 'text-amber-800 dark:text-amber-200',
  },
  {
    key: 'fat' as const,
    label: 'Fat g',
    className: 'border-rose-400/50 bg-rose-400/10 focus-visible:ring-rose-400/40',
    labelClass: 'text-rose-800 dark:text-rose-200',
  },
]

export function DietPlanForm({
  memberId,
  hasGoal,
}: {
  memberId: string
  hasGoal: boolean
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const tomorrow = addDaysIso(localDateIso(), 1)
  const [date, setDate] = React.useState(tomorrow)
  const [notes, setNotes] = React.useState('')
  const [meals, setMeals] = React.useState<DraftMeal[]>(defaultMeals)
  const loadedKey = React.useRef<string | null>(null)

  const plansQuery = useQuery({
    queryKey: queryKeys.diets.byMember(memberId, date),
    queryFn: () => dietsService.list(memberId, date),
    enabled: hasGoal,
  })

  React.useEffect(() => {
    loadedKey.current = null
  }, [date, memberId])

  React.useEffect(() => {
    if (!plansQuery.isFetched) return
    const existing = plansQuery.data?.data?.[0]
    const key = existing?.id ?? `new:${date}`
    if (loadedKey.current === key) return
    loadedKey.current = key
    if (!existing) {
      setNotes('')
      setMeals(defaultMeals())
      return
    }
    setNotes(existing.notes ?? '')
    setMeals(
      existing.meals.length
        ? existing.meals.map((meal) => ({
            ...meal,
            draftId: meal.id ?? newDraftId(),
          }))
        : defaultMeals(),
    )
  }, [plansQuery.isFetched, plansQuery.data, date])

  const updateMeal = (draftId: string, patch: Partial<DraftMeal>) => {
    setMeals((current) =>
      current.map((item) => (item.draftId === draftId ? { ...item, ...patch } : item)),
    )
  }

  const payload = () => ({
    date,
    notes: notes || undefined,
    meals: meals
      .filter((meal) => meal.name.trim().length >= 2)
      .map((meal) => ({
        period: meal.period,
        name: meal.name.trim(),
        quantity: meal.quantity.trim() || '1 serving',
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        notes: meal.notes,
      })),
  })

  const save = useMutation({
    mutationFn: (publish: boolean) =>
      dietsService.save(memberId, { ...payload(), publish }),
    onSuccess: (response, publish) => {
      loadedKey.current = response.data.id
      void queryClient.invalidateQueries({ queryKey: queryKeys.diets.all })
      toast({
        title: publish ? 'Diet plan published' : 'Diet plan saved',
        description: publish
          ? 'The member can now see this plan on their portal.'
          : 'Save as a draft, then publish when the day is complete.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not save diet plan',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  if (!hasGoal) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="px-4 pt-5 text-sm text-muted-foreground sm:px-6">
          Save a member goal first. The diet plan follows that target.
        </CardContent>
      </Card>
    )
  }

  const existing = plansQuery.data?.data?.[0]
  const isTomorrow = date === tomorrow

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-400/25 via-teal-400/15 to-sky-400/20 p-5 shadow-lg shadow-emerald-500/10 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-500/40">
            <Salad className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Step 4 · Diet
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight">
              {isTomorrow ? "Tomorrow’s diet plan" : 'Diet plan'}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Color each time of day, then publish so the member sees the same
              meal board on their portal.
            </p>
          </div>
        </div>

        <DietPeriodLegend className="mt-4" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="diet-date">Plan date</Label>
            <Input
              id="diet-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="border-emerald-400/30 bg-background/80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diet-notes">Trainer instructions</Label>
            <Input
              id="diet-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Hydration, timing, or swap notes"
              className="border-emerald-400/30 bg-background/80"
            />
          </div>
        </div>

        {existing?.publishedAt ? (
          <p className="mt-4 rounded-xl bg-emerald-400/25 px-3 py-2 text-sm font-semibold text-emerald-950 dark:text-emerald-100">
            Live on the member portal since {existing.publishedAt.slice(0, 10)}.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Draft until you publish. Members only see the published plan.
          </p>
        )}
      </div>

      {DIET_PERIODS.map((period) => {
        const periodMeals = meals.filter((meal) => meal.period === period)
        const theme = DIET_PERIOD_THEMES[period]
        return (
          <DietPeriodSection
            key={period}
            period={period}
            actions={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className={cn('border-0 shadow-none', theme.add)}
                onClick={() =>
                  setMeals((current) => [...current, emptyMeal(period)])
                }
              >
                <Plus className="size-4" />
                Add meal
              </Button>
            }
          >
            <div className="space-y-3">
              {periodMeals.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 bg-black/10 px-3 py-4 text-sm text-muted-foreground">
                  Add a meal for this time of day.
                </p>
              ) : null}
              {periodMeals.map((meal) => (
                <div
                  key={meal.draftId}
                  className={cn(
                    'space-y-3 rounded-xl border border-white/10 bg-background/85 p-3 shadow-sm dark:bg-zinc-950/50',
                    'border-l-4',
                    theme.accent,
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Meal details</Label>
                        <Input
                          value={meal.name}
                          onChange={(event) =>
                            updateMeal(meal.draftId, { name: event.target.value })
                          }
                          placeholder={
                            period === 'NIGHT'
                              ? 'e.g. Grilled chicken and rice'
                              : 'e.g. Oats with banana'
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          value={meal.quantity}
                          onChange={(event) =>
                            updateMeal(meal.draftId, {
                              quantity: event.target.value,
                            })
                          }
                          placeholder="e.g. 1 bowl / 200 g"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setMeals((current) =>
                          current.filter((item) => item.draftId !== meal.draftId),
                        )
                      }
                      aria-label="Remove meal"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {NUTRIENT_FIELDS.map((field) => (
                      <div key={field.key} className="space-y-1">
                        <Label className={cn('text-xs', field.labelClass)}>
                          {field.label}
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          step={field.key === 'calories' ? 1 : 0.1}
                          className={field.className}
                          value={meal[field.key] ?? ''}
                          onChange={(event) =>
                            updateMeal(meal.draftId, {
                              [field.key]:
                                event.target.value === ''
                                  ? null
                                  : Number(event.target.value),
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <Textarea
                    value={meal.notes ?? ''}
                    onChange={(event) =>
                      updateMeal(meal.draftId, { notes: event.target.value })
                    }
                    placeholder="Optional notes for this meal"
                  />
                </div>
              ))}
            </div>
          </DietPeriodSection>
        )
      })}

      <div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-2xl border-2 border-emerald-400/35 bg-background/90 p-3 shadow-lg shadow-emerald-500/10 backdrop-blur">
        <Button
          variant="outline"
          disabled={save.isPending}
          onClick={() => save.mutate(false)}
        >
          {save.isPending && !save.variables ? 'Saving…' : 'Save draft'}
        </Button>
        <Button
          className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          disabled={save.isPending}
          onClick={() => save.mutate(true)}
        >
          <Send className="size-4" />
          {save.isPending && save.variables ? 'Publishing…' : 'Publish to member'}
        </Button>
      </div>

      {existing ? (
        <div className="rounded-2xl border-2 border-dashed border-emerald-400/40 bg-emerald-400/5 p-4 sm:p-5">
          <p className="mb-4 text-sm font-bold text-emerald-800 dark:text-emerald-200">
            Member preview
          </p>
          <DietPlanView
            plan={{
              ...existing,
              notes,
              meals: meals.filter((meal) => meal.name.trim().length >= 2),
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
