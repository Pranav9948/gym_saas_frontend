'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, ClipboardCheck, Dumbbell, Search, Users } from 'lucide-react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import {
  StaffModeCards,
  StaffPageHeader,
  localDateIso,
  personInitials,
} from '@/components/staff/staff-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PERMISSIONS } from '@/config'
import { useAuth } from '@/hooks'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import {
  attendanceService,
  membersService,
  queryKeys,
  staffAttendanceService,
  trainersService,
} from '@/services'
import type { Member, Trainer } from '@/types'

export default function StaffAttendancePage() {
  const { toast } = useToast()
  const { hasPermission } = useAuth()
  const queryClient = useQueryClient()
  const [date, setDate] = React.useState(localDateIso)
  const [memberSearch, setMemberSearch] = React.useState('')
  const [trainerSearch, setTrainerSearch] = React.useState('')
  const today = localDateIso()
  const isToday = date === today

  const canViewMembers = hasPermission(PERMISSIONS.MEMBER.VIEW)
  const canViewTrainers = hasPermission(PERMISSIONS.TRAINER.VIEW)
  const canMark = hasPermission(PERMISSIONS.ATTENDANCE.MARK)
  const [mode, setMode] = React.useState<'members' | 'trainers'>(
    canViewMembers ? 'members' : 'trainers',
  )

  const membersQuery = useQuery({
    queryKey: queryKeys.members.list({
      page: 1,
      limit: 50,
      search: memberSearch || undefined,
    }),
    queryFn: () =>
      membersService.getMembers({
        page: 1,
        limit: 50,
        search: memberSearch || undefined,
      }),
    enabled: canViewMembers,
  })

  const memberAttendanceQuery = useQuery({
    queryKey: queryKeys.attendance.history(date),
    queryFn: () =>
      isToday
        ? attendanceService.getTodayAttendance()
        : attendanceService.getAttendanceHistory(date),
  })

  const trainersQuery = useQuery({
    queryKey: queryKeys.trainers.list({ page: 1, limit: 50 }),
    queryFn: () => trainersService.getTrainers({ page: 1, limit: 50 }),
    enabled: canViewTrainers,
  })

  const trainerAttendanceQuery = useQuery({
    queryKey: queryKeys.staffAttendance.byDate(date),
    queryFn: () => staffAttendanceService.listByDate(date),
    enabled: canViewTrainers,
  })

  const checkInMutation = useMutation({
    mutationFn: (memberId: string) =>
      attendanceService.markAttendance({ memberId }),
    onSuccess: () => {
      toast({ title: 'Member checked in' })
      void queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all })
    },
    onError: (error) => {
      toast({
        title: 'Could not check in member',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Please try again.',
        variant: 'destructive',
      })
    },
  })

  const trainerMarkMutation = useMutation({
    mutationFn: ({ userId, present }: { userId: string; present: boolean }) =>
      staffAttendanceService.mark({ userId, date, present }),
    onSuccess: (_data, variables) => {
      toast({
        title: variables.present ? 'Trainer marked present' : 'Trainer marked absent',
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.staffAttendance.all,
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not update trainer attendance',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Please try again.',
        variant: 'destructive',
      })
    },
  })

  const members = membersQuery.data?.members ?? []
  const memberCheckins = memberAttendanceQuery.data?.data ?? []
  const checkedInMemberIds = new Set(
    memberCheckins.map((record) => record.member?.id ?? record.memberId).filter(Boolean),
  )
  const trainers = trainersQuery.data?.trainers ?? []
  const trainerRecords = trainerAttendanceQuery.data?.data ?? []
  const presentTrainerUserIds = new Set(
    trainerRecords.filter((record) => record.present).map((record) => record.userId),
  )
  const trainerQuery = trainerSearch.trim().toLowerCase()
  const visibleTrainers = trainerQuery
    ? trainers.filter((trainer) => {
        const name = `${trainer.user.firstName} ${trainer.user.lastName}`.toLowerCase()
        return (
          name.includes(trainerQuery) ||
          trainer.user.email.toLowerCase().includes(trainerQuery)
        )
      })
    : trainers

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Attendance"
        description="Check members in for today and mark trainers present for a selected date."
      />

      <Card>
        <CardContent className="space-y-2 px-4 pt-4 sm:px-6 sm:pt-6">
          <Label htmlFor="attendance-date">Date</Label>
          <Input
            id="attendance-date"
            type="date"
            value={date}
            max={today}
            onChange={(event) => setDate(event.target.value || today)}
            className="w-full sm:max-w-xs"
          />
          <p className="text-xs text-muted-foreground">
            {isToday
              ? 'Member check-in is available for today.'
              : 'Past dates are view-only for members. Trainer attendance can still be updated.'}
          </p>
        </CardContent>
      </Card>

      <StaffModeCards
        value={mode}
        onChange={setMode}
        options={[
          ...(canViewMembers
            ? [
                {
                  value: 'members' as const,
                  kicker: 'Members',
                  title: 'Front-desk check-in',
                  description: 'Check gym members in for today only.',
                  icon: Users,
                  accent: 'sky' as const,
                },
              ]
            : []),
          ...(canViewTrainers
            ? [
                {
                  value: 'trainers' as const,
                  kicker: 'Trainers',
                  title: 'Coach attendance',
                  description: 'Mark coaches present or absent for this date.',
                  icon: Dumbbell,
                  accent: 'amber' as const,
                },
              ]
            : []),
        ]}
      />

      {mode === 'members' && canViewMembers ? (
        <Card className="overflow-hidden border-sky-500/30">
          <div className="border-b border-sky-500/20 bg-sky-500/10 px-4 py-3 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Members
            </p>
            <h2 className="text-base font-semibold">Today&apos;s check-in list</h2>
            <p className="text-sm text-muted-foreground">
              {isToday
                ? 'Tap Check in when a member arrives at the gym.'
                : 'Past dates are view-only for members. Switch to today to check someone in.'}
            </p>
          </div>
          <CardContent className="space-y-4 px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="relative sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={memberSearch}
                onChange={(event) => setMemberSearch(event.target.value)}
                placeholder="Search members"
                className="pl-9"
                aria-label="Search members"
              />
            </div>

            {membersQuery.isLoading || memberAttendanceQuery.isLoading ? (
              <div className="flex min-h-40 items-center justify-center">
                <LoadingSpinner label="Loading member attendance…" />
              </div>
            ) : membersQuery.isError || memberAttendanceQuery.isError ? (
              <EmptyState
                icon={<ClipboardCheck className="size-8 text-muted-foreground" />}
                title="Could not load member attendance"
                description="Check your connection and try again."
              />
            ) : members.length === 0 ? (
              <EmptyState
                icon={<Users className="size-8 text-muted-foreground" />}
                title="No members found"
                description="Add members first, then check them in here."
              />
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <MemberAttendanceRow
                    key={member.id}
                    member={member}
                    checkedIn={checkedInMemberIds.has(member.id)}
                    canCheckIn={canMark && isToday && member.status === 'ACTIVE'}
                    checkingIn={checkInMutation.isPending}
                    onCheckIn={() => checkInMutation.mutate(member.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {mode === 'trainers' && canViewTrainers ? (
        <Card className="overflow-hidden border-amber-500/30">
          <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Trainers
            </p>
            <h2 className="text-base font-semibold">Coach attendance</h2>
            <p className="text-sm text-muted-foreground">
              Mark trainers present or absent for {date}. This can be updated for past dates too.
            </p>
          </div>
          <CardContent className="space-y-4 px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="relative sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={trainerSearch}
                onChange={(event) => setTrainerSearch(event.target.value)}
                placeholder="Search trainers"
                className="pl-9"
                aria-label="Search trainers"
              />
            </div>

            {trainersQuery.isLoading || trainerAttendanceQuery.isLoading ? (
              <div className="flex min-h-40 items-center justify-center">
                <LoadingSpinner label="Loading trainer attendance…" />
              </div>
            ) : trainersQuery.isError || trainerAttendanceQuery.isError ? (
              <EmptyState
                icon={<ClipboardCheck className="size-8 text-muted-foreground" />}
                title="Could not load trainer attendance"
                description="Check your connection and try again."
              />
            ) : visibleTrainers.length === 0 ? (
              <EmptyState
                icon={<Dumbbell className="size-8 text-muted-foreground" />}
                title="No trainers found"
                description="Create trainers first, then mark them present here."
              />
            ) : (
              <div className="space-y-3">
                {visibleTrainers.map((trainer) => (
                  <TrainerAttendanceRow
                    key={trainer.id}
                    trainer={trainer}
                    present={Boolean(
                      trainer.userId && presentTrainerUserIds.has(trainer.userId),
                    )}
                    canMark={canMark && Boolean(trainer.userId)}
                    pending={trainerMarkMutation.isPending}
                    onMark={(present) => {
                      if (!trainer.userId) return
                      trainerMarkMutation.mutate({
                        userId: trainer.userId,
                        present,
                      })
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function MemberAttendanceRow({
  member,
  checkedIn,
  canCheckIn,
  checkingIn,
  onCheckIn,
}: {
  member: Member
  checkedIn: boolean
  canCheckIn: boolean
  checkingIn: boolean
  onCheckIn: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-sky-500/15 text-xs font-semibold text-sky-700 dark:text-sky-400">
            {personInitials(member.firstName, member.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {member.firstName} {member.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {checkedIn ? (
          <Badge className="gap-1 border-transparent bg-success/12 text-success">
            <CheckCircle2 className="size-3.5" />
            Checked in
          </Badge>
        ) : canCheckIn ? (
          <Button size="sm" disabled={checkingIn} onClick={onCheckIn}>
            Check in
          </Button>
        ) : (
          <Badge variant="outline">Not checked in</Badge>
        )}
      </div>
    </div>
  )
}

function TrainerAttendanceRow({
  trainer,
  present,
  canMark,
  pending,
  onMark,
}: {
  trainer: Trainer
  present: boolean
  canMark: boolean
  pending: boolean
  onMark: (present: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-amber-500/15 text-xs font-semibold text-amber-700 dark:text-amber-400">
            {personInitials(trainer.user.firstName, trainer.user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {trainer.user.firstName} {trainer.user.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {trainer.specialization || trainer.user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {present ? (
          <>
            <Badge className="gap-1 border-transparent bg-success/12 text-success">
              <CheckCircle2 className="size-3.5" />
              Present
            </Badge>
            {canMark ? (
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => onMark(false)}
              >
                Mark absent
              </Button>
            ) : null}
          </>
        ) : canMark ? (
          <Button size="sm" disabled={pending} onClick={() => onMark(true)}>
            Mark present
          </Button>
        ) : (
          <Badge variant="outline">Absent</Badge>
        )}
      </div>
    </div>
  )
}
