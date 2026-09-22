'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  CircleDollarSign,
  Dumbbell,
  Plus,
  Users,
} from 'lucide-react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import { StatCard } from '@/components/common/StatCard'
import { StaffAddMemberDialog } from '@/components/staff/StaffAddMemberDialog'
import { StaffAddTrainerDialog } from '@/components/staff/StaffAddTrainerDialog'
import {
  DaysLeftChip,
  PaymentStatusBadge,
  StaffPageHeader,
  isMemberOverdue,
} from '@/components/staff/staff-ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PERMISSIONS, ROUTES } from '@/config'
import { useAuth } from '@/hooks'
import { membersService, queryKeys, trainersService } from '@/services'
import type { Member } from '@/types'

function uniqueMembers(...groups: Member[][]) {
  const seen = new Set<string>()
  const result: Member[] = []
  for (const group of groups) {
    for (const member of group) {
      if (seen.has(member.id)) continue
      seen.add(member.id)
      result.push(member)
    }
  }
  return result
}

export default function StaffDashboardPage() {
  const { user, hasPermission } = useAuth()
  const queryClient = useQueryClient()
  const [addMemberOpen, setAddMemberOpen] = React.useState(false)
  const [addTrainerOpen, setAddTrainerOpen] = React.useState(false)

  const canCreateMember = hasPermission(PERMISSIONS.MEMBER.CREATE)
  const canViewTrainers = hasPermission(PERMISSIONS.TRAINER.VIEW)
  const canCreateTrainer =
    hasPermission(PERMISSIONS.USER.INVITE) ||
    hasPermission(PERMISSIONS.TRAINER.CREATE)

  const membersQuery = useQuery({
    queryKey: queryKeys.members.list({ page: 1, limit: 1 }),
    queryFn: () => membersService.getMembers({ page: 1, limit: 1 }),
  })

  const pendingQuery = useQuery({
    queryKey: queryKeys.members.list({
      page: 1,
      limit: 5,
      paymentStatus: 'PENDING',
    }),
    queryFn: () =>
      membersService.getMembers({
        page: 1,
        limit: 5,
        paymentStatus: 'PENDING',
      }),
  })

  const overdueQuery = useQuery({
    queryKey: queryKeys.members.list({
      page: 1,
      limit: 5,
      paymentStatus: 'OVERDUE',
    }),
    queryFn: () =>
      membersService.getMembers({
        page: 1,
        limit: 5,
        paymentStatus: 'OVERDUE',
      }),
  })

  const trainersQuery = useQuery({
    queryKey: queryKeys.trainers.list({ page: 1, limit: 1 }),
    queryFn: () => trainersService.getTrainers({ page: 1, limit: 1 }),
    enabled: canViewTrainers,
  })

  const dueMembers = uniqueMembers(
    overdueQuery.data?.members ?? [],
    pendingQuery.data?.members ?? [],
  ).slice(0, 8)

  const isLoading =
    membersQuery.isLoading ||
    pendingQuery.isLoading ||
    overdueQuery.isLoading ||
    trainersQuery.isLoading

  const isError =
    membersQuery.isError ||
    pendingQuery.isError ||
    overdueQuery.isError ||
    trainersQuery.isError

  const pendingCount = pendingQuery.data?.meta.total ?? 0
  const overdueCount = overdueQuery.data?.meta.total ?? 0
  const dueCount = pendingCount + overdueCount

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title={`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}`}
        description="Add members, assign trainers, and keep gym fees current."
        actions={
          <>
            {canCreateMember ? (
              <Button className="w-full sm:w-auto" onClick={() => setAddMemberOpen(true)}>
                <Plus className="size-4" />
                Add member
              </Button>
            ) : null}
            {canCreateTrainer ? (
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setAddTrainerOpen(true)}
              >
                <Plus className="size-4" />
                Add trainer
              </Button>
            ) : null}
          </>
        }
      />

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoadingSpinner label="Loading dashboard…" />
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load dashboard"
          description="Check your connection and try again."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Members"
              value={String(membersQuery.data?.meta.total ?? 0)}
              icon={Users}
              hint="People currently enrolled"
            />
            <StatCard
              label="Payments due"
              value={String(dueCount)}
              icon={CircleDollarSign}
              hint={`${overdueCount} overdue · ${pendingCount} pending`}
              className={overdueCount > 0 ? 'bg-destructive/5' : undefined}
            />
            {canViewTrainers ? (
              <StatCard
                label="Trainers"
                value={String(trainersQuery.data?.meta.total ?? 0)}
                icon={Dumbbell}
                hint="Available for personal training"
                className="sm:col-span-2 lg:col-span-1"
              />
            ) : null}
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Payments needing attention</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Members with pending or overdue fees.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="self-start sm:self-auto" asChild>
                <Link href={ROUTES.MEMBERS}>
                  View all members
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="px-0 pt-0 sm:px-0">
              {dueMembers.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No pending or overdue member fees right now.
                </p>
              ) : (
                <>
                  <div className="divide-y md:hidden">
                    {dueMembers.map((member) => (
                      <DueMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                  <div className="hidden overflow-x-auto md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Days left</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dueMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">
                              {member.firstName} {member.lastName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {member.membershipPackage?.name ?? '—'}
                            </TableCell>
                            <TableCell>
                              <PaymentStatusBadge
                                status={member.paymentStatus}
                                overdue={isMemberOverdue(member)}
                              />
                            </TableCell>
                            <TableCell>
                              <DaysLeftChip remainingDays={member.remainingDays} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <StaffAddMemberDialog
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
        }}
      />
      <StaffAddTrainerDialog
        open={addTrainerOpen}
        onOpenChange={setAddTrainerOpen}
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
        }}
      />
    </div>
  )
}

function DueMemberCard({ member }: { member: Member }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium">
          {member.firstName} {member.lastName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {member.membershipPackage?.name ?? 'No package'}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <PaymentStatusBadge
          status={member.paymentStatus}
          overdue={isMemberOverdue(member)}
        />
        <DaysLeftChip remainingDays={member.remainingDays} />
      </div>
    </div>
  )
}
