'use client'

import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Dumbbell, Plus, Search } from 'lucide-react'
import { EmptyState, LoadingSpinner, Pagination } from '@/components/common'
import { StaffAddTrainerDialog } from '@/components/staff/StaffAddTrainerDialog'
import { StaffPageHeader } from '@/components/staff/staff-ui'
import { StaffTrainerCard } from '@/components/staff/StaffTrainerCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PERMISSIONS } from '@/config'
import { useAuth } from '@/hooks'
import { queryKeys, trainersService } from '@/services'

const PAGE_SIZE = 12

export default function StaffTrainersPage() {
  const { hasPermission } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(1)
  const [query, setQuery] = React.useState('')
  const [addOpen, setAddOpen] = React.useState(false)

  const canCreate =
    hasPermission(PERMISSIONS.USER.INVITE) ||
    hasPermission(PERMISSIONS.TRAINER.CREATE)

  const trainersQuery = useQuery({
    queryKey: queryKeys.trainers.list({ page, limit: PAGE_SIZE }),
    queryFn: () => trainersService.getTrainers({ page, limit: PAGE_SIZE }),
  })

  const trainers = trainersQuery.data?.trainers ?? []
  const total = trainersQuery.data?.meta.total ?? 0
  const totalPages = trainersQuery.data?.meta.totalPages ?? 1
  const search = query.trim().toLowerCase()
  const visibleTrainers = search
    ? trainers.filter((trainer) => {
        const name =
          `${trainer.user.firstName} ${trainer.user.lastName}`.toLowerCase()
        return (
          name.includes(search) ||
          trainer.user.email.toLowerCase().includes(search) ||
          (trainer.specialization ?? '').toLowerCase().includes(search)
        )
      })
    : trainers

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Trainers"
        description="Create trainers so members with personal training can be assigned."
        actions={
          canCreate ? (
            <Button className="w-full sm:w-auto" onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Add trainer
            </Button>
          ) : null
        }
      />

      <div className="relative min-w-0 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, or specialization"
          className="pl-9"
          aria-label="Search trainers"
        />
      </div>

      {trainersQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner label="Loading trainers…" />
        </div>
      ) : trainersQuery.isError ? (
        <EmptyState
          icon={<Dumbbell className="size-8 text-muted-foreground" />}
          title="Could not load trainers"
          description="Check your connection and try again."
        />
      ) : visibleTrainers.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="size-8 text-muted-foreground" />}
          title={trainers.length === 0 ? 'No trainers yet' : 'No matching trainers'}
          description={
            trainers.length === 0 && canCreate
              ? 'Create a trainer with a photo, then assign them when a member needs personal training.'
              : 'Try a different search.'
          }
          action={
            trainers.length === 0 && canCreate ? (
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="size-4" />
                Add trainer
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleTrainers.map((trainer) => (
              <StaffTrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {total} trainer{total === 1 ? '' : 's'}
            </p>
            {totalPages > 1 ? (
              <div className="overflow-x-auto">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  isLoading={trainersQuery.isFetching}
                />
              </div>
            ) : null}
          </div>
        </>
      )}

      <StaffAddTrainerDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
        }}
      />
    </div>
  )
}
