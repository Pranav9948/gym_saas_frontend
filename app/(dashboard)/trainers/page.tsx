'use client'

import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Dumbbell, Plus, Search } from 'lucide-react'
import { EmptyState, LoadingSpinner, Pagination } from '@/components/common'
import { StaffAddTrainerDialog } from '@/components/staff/StaffAddTrainerDialog'
import { StaffPageHeader, personInitials } from '@/components/staff/staff-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PERMISSIONS } from '@/config'
import { useAuth } from '@/hooks'
import { queryKeys, trainersService } from '@/services'
import type { Trainer } from '@/types'

const PAGE_SIZE = 10

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

      <Card>
        <CardContent className="space-y-4 px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="relative min-w-0 sm:max-w-xs">
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
            <div className="flex min-h-48 items-center justify-center">
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
                  ? 'Create a trainer, then assign them when a member needs personal training.'
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
              <div className="space-y-3 md:hidden">
                {visibleTrainers.map((trainer) => (
                  <TrainerMobileCard key={trainer.id} trainer={trainer} />
                ))}
              </div>

              <div className="-mx-4 hidden overflow-x-auto md:mx-0 md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trainer</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Assigned members</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleTrainers.map((trainer) => (
                      <TableRow key={trainer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                {personInitials(
                                  trainer.user.firstName,
                                  trainer.user.lastName,
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">
                                {trainer.user.firstName} {trainer.user.lastName}
                              </div>
                              <p className="truncate text-xs text-muted-foreground">
                                {trainer.user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {trainer.specialization || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {trainer._count?.members ?? 0}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
        </CardContent>
      </Card>

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

function TrainerMobileCard({ trainer }: { trainer: Trainer }) {
  return (
    <div className="rounded-xl border bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
            {personInitials(trainer.user.firstName, trainer.user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {trainer.user.firstName} {trainer.user.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {trainer.user.email}
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {trainer._count?.members ?? 0} members
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {trainer.specialization || 'No specialization listed'}
          </p>
        </div>
      </div>
    </div>
  )
}
