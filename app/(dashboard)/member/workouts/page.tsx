'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity } from 'lucide-react'
import { LoadingSpinner } from '@/components/common'
import { WorkoutLogForm } from '@/components/member/WorkoutLogForm'
import { WorkoutPerformanceBoard } from '@/components/member/WorkoutPerformanceBoard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { portalService, queryKeys } from '@/services'
import type { MuscleGroup } from '@/types'

export default function MemberWorkoutsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [tab, setTab] = React.useState('log')
  const [muscleGroup, setMuscleGroup] = React.useState<MuscleGroup | ''>('')
  const [exercise, setExercise] = React.useState('')

  const catalogQuery = useQuery({
    queryKey: queryKeys.portal.workoutCatalog(),
    queryFn: () => portalService.getWorkoutCatalog(),
  })

  const performanceQuery = useQuery({
    queryKey: queryKeys.portal.workoutPerformance(muscleGroup || undefined, exercise),
    queryFn: () => portalService.getWorkoutPerformance(muscleGroup, exercise),
    enabled: Boolean(muscleGroup && exercise.trim().length >= 2),
  })

  const save = useMutation({
    mutationFn: portalService.createWorkoutLog,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.portal.all })
      toast({
        title: 'Workout saved',
        description: 'This session is now on your history. It does not replace older logs.',
      })
      setTab('history')
    },
    onError: (error) => {
      toast({
        title: 'Could not save workout',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Add an exercise name plus at least one set.',
        variant: 'destructive',
      })
    },
  })

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border-2 border-amber-400/45 bg-gradient-to-br from-amber-400/25 via-orange-400/15 to-rose-400/15 p-5 shadow-lg shadow-amber-500/10 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-md shadow-amber-500/40">
            <Activity className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workout tracking</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Log your own sets even without a trainer, then compare this week
              with last week.
            </p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="log">Log workout</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="log" className="mt-4">
          {catalogQuery.isLoading ? (
            <LoadingSpinner label="Loading exercises…" />
          ) : (
            <WorkoutLogForm
              key={save.dataUpdatedAt}
              catalog={catalogQuery.data?.data}
              isSaving={save.isPending}
              onSave={(payload) => save.mutate(payload)}
            />
          )}
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <WorkoutPerformanceBoard
            muscleGroup={muscleGroup}
            exercise={exercise}
            catalog={catalogQuery.data?.data}
            performance={performanceQuery.data?.data}
            isLoading={performanceQuery.isFetching}
            onMuscleGroupChange={setMuscleGroup}
            onExerciseChange={setExercise}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
