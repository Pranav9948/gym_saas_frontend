'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dumbbell,
  Plus,
  Search,
  UserCheck,
  Users,
} from 'lucide-react'
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { StatCard } from '@/components/common/StatCard'
import { AddPersonDialog } from '@/components/owner/AddPersonDialog'
import { TrainerCard } from '@/components/owner/trainers/TrainerCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { trainersService, staffAttendanceService } from '@/services'
import { queryKeys } from '@/services/queryKeys'
import { ApiException } from '@/lib/api/errors'
import { resolveMediaUrl } from '@/lib/helpers/media'
import { useToast } from '@/hooks/use-toast'
import type { TrainerOverview } from '@/types'

export default function OwnerTrainersPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [addOpen, setAddOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [range, setRange] = React.useState<'this_month' | 'last_month' | 'custom'>(
    'this_month',
  )
  const [from, setFrom] = React.useState('')
  const [to, setTo] = React.useState('')

  const overviewQuery = useQuery({
    queryKey: queryKeys.trainers.overview(),
    queryFn: () => trainersService.getOverview(),
  })

  const performanceQuery = useQuery({
    queryKey: queryKeys.trainers.performance(selectedId ?? '', { range, from, to }),
    queryFn: () =>
      trainersService.getPerformance(selectedId!, {
        range,
        from: range === 'custom' ? from : undefined,
        to: range === 'custom' ? to : undefined,
      }),
    enabled: Boolean(selectedId),
  })

  const trainers = overviewQuery.data?.data ?? []
  const performance = performanceQuery.data?.data
  const search = query.trim().toLowerCase()
  const visible = search
    ? trainers.filter((trainer) => {
        const name = `${trainer.user.firstName} ${trainer.user.lastName}`.toLowerCase()
        return (
          name.includes(search) ||
          trainer.user.email.toLowerCase().includes(search) ||
          (trainer.specialization ?? '').toLowerCase().includes(search)
        )
      })
    : trainers
  const membersCoached = trainers.reduce(
    (sum, trainer) => sum + trainer.assignedMemberCount,
    0,
  )
  const activeTrainers = trainers.filter((trainer) => trainer.user.isActive).length

  const markMutation = useMutation({
    mutationFn: () => {
      const trainer = trainers.find((item) => item.id === selectedId)
      if (!trainer) throw new Error('Trainer not found')
      return staffAttendanceService.mark({
        userId: trainer.userId,
        date: new Date().toISOString().slice(0, 10),
        present: true,
      })
    },
    onSuccess: () => {
      toast({ title: 'Trainer marked present today' })
      void queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
    },
    onError: (error) => {
      toast({
        title: 'Could not mark attendance',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Please try again.',
        variant: 'destructive',
      })
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainers"
        description="Photos, assigned members, and attendance for every coach in your gym."
        actions={
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add trainer
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Trainers"
          value={String(trainers.length)}
          icon={Dumbbell}
          hint="Coaches on this gym"
        />
        <StatCard
          label="Active"
          value={String(activeTrainers)}
          icon={UserCheck}
          hint="Can log in and take members"
        />
        <StatCard
          label="Members coached"
          value={String(membersCoached)}
          icon={Users}
          hint="Assigned across every trainer"
        />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search trainers…"
          className="h-10 pl-9"
          aria-label="Search trainers"
        />
      </div>

      {overviewQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner label="Loading trainers…" />
        </div>
      ) : overviewQuery.isError ? (
        <EmptyState
          icon={<Dumbbell className="size-8 text-muted-foreground" />}
          title="Could not load trainers"
          description="Check your connection and try again."
        />
      ) : trainers.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="size-8 text-muted-foreground" />}
          title="No trainers yet"
          description="Add a trainer with a photo, specialization, and login so you can assign members to them."
          action={
            <Button className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Add trainer
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No matching trainers"
          description="Try a different name, email, or specialization."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onOpen={() => setSelectedId(trainer.id)}
            />
          ))}
        </div>
      )}

      <AddPersonDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultType="trainer"
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
        }}
      />

      <TrainerPerformanceDialog
        open={Boolean(selectedId)}
        onOpenChange={(next) => {
          if (!next) setSelectedId(null)
        }}
        trainer={trainers.find((item) => item.id === selectedId) ?? null}
        range={range}
        from={from}
        to={to}
        onRangeChange={setRange}
        onFromChange={setFrom}
        onToChange={setTo}
        loading={performanceQuery.isLoading}
        marking={markMutation.isPending}
        onMarkPresent={() => markMutation.mutate()}
        performance={performance}
      />
    </div>
  )
}

function TrainerPerformanceDialog({
  open,
  onOpenChange,
  trainer,
  range,
  from,
  to,
  onRangeChange,
  onFromChange,
  onToChange,
  loading,
  marking,
  onMarkPresent,
  performance,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  trainer: TrainerOverview | null
  range: 'this_month' | 'last_month' | 'custom'
  from: string
  to: string
  onRangeChange: (value: 'this_month' | 'last_month' | 'custom') => void
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  loading: boolean
  marking: boolean
  onMarkPresent: () => void
  performance?: {
    from: string
    to: string
    totalDaysInRange: number
    daysPresent: number
    assignedMembers: Array<{
      id: string
      firstName: string
      lastName: string
      trainingStatus: 'ACTIVE' | 'INACTIVE'
      membershipPackage?: { name: string } | null
    }>
  }
}) {
  const name = trainer
    ? `${trainer.user.firstName} ${trainer.user.lastName}`.trim()
    : 'Trainer'
  const photo = resolveMediaUrl(trainer?.user.avatarUrl)
  const initials = `${trainer?.user.firstName?.[0] ?? ''}${trainer?.user.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-6">
            <Avatar className="size-12">
              {photo ? <AvatarImage src={photo} alt="" /> : null}
              <AvatarFallback className="bg-primary/15 font-semibold text-primary">
                {initials || 'TR'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="truncate">{name}</DialogTitle>
              <DialogDescription>
                {trainer?.specialization || 'Attendance and assigned members'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Period</Label>
            <Select value={range} onValueChange={(value) => onRangeChange(value as typeof range)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">This month</SelectItem>
                <SelectItem value="last_month">Last month</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {range === 'custom' ? (
            <>
              <div className="space-y-2">
                <Label>From</Label>
                <Input type="date" value={from} onChange={(event) => onFromChange(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Input type="date" value={to} onChange={(event) => onToChange(event.target.value)} />
              </div>
            </>
          ) : null}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : !performance ? (
          <p className="text-sm text-muted-foreground">
            Could not load performance for this period.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Days present</p>
                  <p className="text-2xl font-semibold">{performance.daysPresent}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-end justify-between pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Days in range</p>
                    <p className="text-2xl font-semibold">{performance.totalDaysInRange}</p>
                  </div>
                  <Button size="sm" variant="outline" disabled={marking} onClick={onMarkPresent}>
                    Mark present today
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Users className="size-4" />
                Assigned members
              </h3>
              {performance.assignedMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members assigned.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {performance.assignedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.membershipPackage?.name ?? 'No package'}
                        </p>
                      </div>
                      <Badge
                        variant={
                          member.trainingStatus === 'ACTIVE' ? 'secondary' : 'outline'
                        }
                      >
                        {member.trainingStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
