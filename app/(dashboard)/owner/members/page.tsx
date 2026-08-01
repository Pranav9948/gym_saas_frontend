'use client'

import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Eye,
  Pencil,
  Plus,
  Search,
  Shield,
  UserCheck,
  Users,
  Users2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState, LoadingSpinner, PageHeader, StatusBadge } from '@/components/common'
import { StatCard } from '@/components/common/StatCard'
import { AddPersonDialog } from '@/components/owner/AddPersonDialog'
import { membersService, tenantService } from '@/services'
import { queryKeys } from '@/services/queryKeys'
import { ROLE_LABELS } from '@/constants/roles'
import type { PersonType } from '@/schemas/owner-person.schema'
import { StatusType } from '@/types'
import type { TenantRole } from '@/types'

const PAGE_SIZE = 10

type PageTab = 'members' | 'team'

function formatJoinedDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function TeamRoleBadge({ role }: { role: string }) {
  const label = ROLE_LABELS[role as TenantRole] ?? role
  const variant =
    role === 'OWNER'
      ? 'default'
      : role === 'ADMIN'
        ? 'secondary'
        : role === 'TRAINER'
          ? 'outline'
          : 'outline'

  return <Badge variant={variant}>{label}</Badge>
}

export default function OwnerMembersPage() {
  const queryClient = useQueryClient()
  const [pageTab, setPageTab] = React.useState<PageTab>('members')
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [addOpen, setAddOpen] = React.useState(false)
  const [addDefaultType, setAddDefaultType] = React.useState<PersonType>('member')

  const membersQuery = useQuery({
    queryKey: queryKeys.members.list({ page, limit: PAGE_SIZE }),
    queryFn: () => membersService.getMembers({ page, limit: PAGE_SIZE }),
    enabled: pageTab === 'members',
  })

  const teamQuery = useQuery({
    queryKey: queryKeys.tenant.team(),
    queryFn: () => tenantService.listTeamMembers(),
    enabled: pageTab === 'team',
  })

  const members = membersQuery.data?.members ?? []
  const total = membersQuery.data?.meta.total ?? 0
  const totalPages = membersQuery.data?.meta.totalPages ?? 1

  const teamMembers =
    teamQuery.data?.data.filter((member) => member.role !== 'OWNER') ?? []

  const filteredMembers = members.filter((m) => {
    const q = query.toLowerCase()
    if (!q) return true
    const trainerName = m.assignedTrainer
      ? `${m.assignedTrainer.user.firstName} ${m.assignedTrainer.user.lastName}`
      : ''
    return (
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      trainerName.toLowerCase().includes(q)
    )
  })

  const filteredTeam = teamMembers.filter((m) => {
    const q = query.toLowerCase()
    if (!q) return true
    return (
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    )
  })

  const activeCount = members.filter((m) => m.status === 'ACTIVE').length
  const trainerCount = teamMembers.filter((m) => m.role === 'TRAINER').length
  const staffCount = teamMembers.filter(
    (m) => m.role === 'STAFF' || m.role === 'ADMIN',
  ).length

  const openAddDialog = (type?: PersonType) => {
    if (type) {
      setAddDefaultType(type)
    } else if (pageTab === 'team') {
      setAddDefaultType('staff')
    } else {
      setAddDefaultType('member')
    }
    setAddOpen(true)
  }

  const handleAdded = (type: PersonType) => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
    void queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
    void queryClient.invalidateQueries({ queryKey: queryKeys.tenant.team() })

    if (type !== 'member') {
      setPageTab('team')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="People"
        description="Manage gym members and your team (staff, admins, trainers)."
        actions={
          <Button className="gap-2" onClick={() => openAddDialog()}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add person</span>
          </Button>
        }
      />

      <AddPersonDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={handleAdded}
        defaultType={addDefaultType}
      />

      <Tabs
        value={pageTab}
        onValueChange={(value) => {
          setPageTab(value as PageTab)
          setQuery('')
          setPage(1)
        }}
      >
        <TabsList>
          <TabsTrigger value="members" className="gap-1.5">
            <Users className="size-3.5" />
            Gym members
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5">
            <Shield className="size-3.5" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Total members" value={String(total)} icon={Users} />
            <StatCard
              label="Active on page"
              value={String(activeCount)}
              icon={UserCheck}
            />
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search members..."
                  className="pl-9"
                  aria-label="Search members"
                />
              </div>

              {membersQuery.isLoading ? (
                <LoadingSpinner />
              ) : membersQuery.isError ? (
                <EmptyState
                  icon={<Users2 className="size-8 text-muted-foreground" />}
                  title="Could not load members"
                  description="Check your connection and try again."
                />
              ) : filteredMembers.length === 0 ? (
                <EmptyState
                  icon={<Users2 className="size-8 text-muted-foreground" />}
                  title="No members found"
                  description={
                    query
                      ? 'Try adjusting your search.'
                      : 'Add your first gym member to get started.'
                  }
                  action={
                    !query ? (
                      <Button
                        onClick={() => openAddDialog('member')}
                        className="gap-2"
                      >
                        <Plus className="size-4" />
                        Add member
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Trainer</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="size-9">
                                  <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                    {`${m.firstName[0]}${m.lastName[0]}`.toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="truncate font-medium text-foreground mb-0.5">
                                    {m.firstName} {m.lastName}
                                  </div>
                                  <StatusBadge
                                    status={m.status.toLowerCase() as StatusType}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {m.email}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {m.phone ?? '—'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {m.assignedTrainer
                                ? `${m.assignedTrainer.user.firstName} ${m.assignedTrainer.user.lastName}`
                                : '—'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatJoinedDate(m.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="View member"
                                >
                                  <Eye className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Edit member"
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages} · {total} total members
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <span className="px-2 text-sm tabular-nums text-muted-foreground">
                        {page} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        aria-label="Next page"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Team members"
              value={String(teamMembers.length)}
              icon={Shield}
            />
            <StatCard label="Trainers" value={String(trainerCount)} icon={Dumbbell} />
            <StatCard label="Staff & admins" value={String(staffCount)} icon={Users} />
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search team..."
                    className="pl-9"
                    aria-label="Search team"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddDialog('staff')}
                  >
                    Add staff
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddDialog('admin')}
                  >
                    Add admin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddDialog('trainer')}
                  >
                    Add trainer
                  </Button>
                </div>
              </div>

              {teamQuery.isLoading ? (
                <LoadingSpinner />
              ) : teamQuery.isError ? (
                <EmptyState
                  icon={<Shield className="size-8 text-muted-foreground" />}
                  title="Could not load team"
                  description="Check your connection and try again."
                />
              ) : filteredTeam.length === 0 ? (
                <EmptyState
                  icon={<Shield className="size-8 text-muted-foreground" />}
                  title="No team members yet"
                  description={
                    query
                      ? 'Try adjusting your search.'
                      : 'Create staff, admins, or trainers who can log in to your gym dashboard.'
                  }
                  action={
                    !query ? (
                      <Button
                        onClick={() => openAddDialog('staff')}
                        className="gap-2"
                      >
                        <Plus className="size-4" />
                        Add team member
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeam.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9">
                                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                  {`${member.firstName[0]}${member.lastName[0]}`.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-foreground">
                                {member.firstName} {member.lastName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {member.email}
                          </TableCell>
                          <TableCell>
                            <TeamRoleBadge role={member.role} />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={member.isActive ? 'secondary' : 'destructive'}
                            >
                              {member.isActive ? 'Active' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(new Date(member.joinedAt), {
                              addSuffix: true,
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
