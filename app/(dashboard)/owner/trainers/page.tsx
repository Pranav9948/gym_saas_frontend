'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Dumbbell, Users } from 'lucide-react'
import { PageHeader, EmptyState, LoadingSpinner } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trainersService, staffAttendanceService } from '@/services'
import { queryKeys } from '@/services/queryKeys'
import { ApiException } from '@/lib/api/errors'
import { useToast } from '@/hooks/use-toast'
import type { TrainerOverview } from '@/types'

export default function OwnerTrainersPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
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
        description="See who each trainer coaches, then open performance and attendance for a date range."
      />

      <Card>
        <CardContent className="pt-6">
          {overviewQuery.isLoading ? (
            <LoadingSpinner />
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
              description="Create a trainer from People, then assign members to them."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Assigned members</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((trainer) => (
                  <TableRow key={trainer.id}>
                    <TableCell>
                      <div className="font-medium">
                        {trainer.user.firstName} {trainer.user.lastName}
                      </div>
                      <p className="text-sm text-muted-foreground">{trainer.user.email}</p>
                    </TableCell>
                    <TableCell>{trainer.specialization ?? '—'}</TableCell>
                    <TableCell>
                      {trainer.assignedMemberCount === 0
                        ? 'None assigned'
                        : trainer.members
                            .map((member) => `${member.firstName} ${member.lastName}`)
                            .join(', ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedId(trainer.id)}>
                        Performance
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {trainer
              ? `${trainer.user.firstName} ${trainer.user.lastName}`
              : 'Trainer performance'}
          </DialogTitle>
          <DialogDescription>
            Attendance days present and currently assigned members.
          </DialogDescription>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Training</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performance.assignedMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell>{member.membershipPackage?.name ?? '—'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.trainingStatus === 'ACTIVE' ? 'secondary' : 'outline'
                            }
                          >
                            {member.trainingStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
