'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Check, Search, Users, X } from 'lucide-react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import { StaffPageHeader, localDateIso, personInitials } from '@/components/staff/staff-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/config'
import { cn } from '@/lib/utils'
import { queryKeys, trainersService } from '@/services'
import type { Member } from '@/types'

function hasFeature(member: Member, feature: string) {
  return Boolean(member.membershipPackage?.features?.includes(feature))
}

function StatusChip({
  done,
  doneLabel,
  pendingLabel,
}: {
  done: boolean
  doneLabel: string
  pendingLabel: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        done
          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {done ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" />}
      {done ? doneLabel : pendingLabel}
    </span>
  )
}

export default function TrainerMembersPage() {
  const [query, setQuery] = React.useState('')
  const today = localDateIso()

  const membersQuery = useQuery({
    queryKey: queryKeys.trainers.myMembers({ page: 1, limit: 50, date: today }),
    queryFn: () =>
      trainersService.getMyMembers({ page: 1, limit: 50, date: today }),
  })

  const members = (membersQuery.data?.members ?? []).filter((member) => {
    const haystack = `${member.firstName} ${member.lastName} ${member.email}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="My members"
        description="See who has today’s workout tracked and diet shared, then open a member to coach them."
      />

      <div className="relative sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search assigned members"
          className="pl-9"
        />
      </div>

      {membersQuery.isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoadingSpinner label="Loading your members…" />
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={<Users className="size-8 text-muted-foreground" />}
          title="No assigned members yet"
          description="Staff will assign members on a personal-training package to you."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {members.map((member) => {
            const hasDiet = hasFeature(member, 'customized_diet_plan')
            const workoutTracked = Boolean(member.todayStatus?.workoutTracked)
            const dietShared = Boolean(member.todayStatus?.dietShared)
            return (
              <Link key={member.id} href={ROUTES.TRAINER_MEMBER(member.id)}>
                <Card className="h-full transition-colors hover:border-primary/30">
                  <CardContent className="flex items-start gap-3 px-4 pt-4 sm:px-5">
                    <Avatar className="size-11">
                      <AvatarFallback className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
                        {personInitials(member.firstName, member.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {member.membershipPackage?.name ?? 'No package'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <StatusChip
                          done={workoutTracked}
                          doneLabel="Today’s workout tracked"
                          pendingLabel="Workout not tracked today"
                        />
                        {hasDiet ? (
                          <StatusChip
                            done={dietShared}
                            doneLabel="Diet shared"
                            pendingLabel="Diet not shared today"
                          />
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {hasFeature(member, 'personal_training') ? (
                          <Badge variant="secondary">Personal training</Badge>
                        ) : null}
                        {hasDiet ? <Badge variant="outline">Diet plan</Badge> : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
