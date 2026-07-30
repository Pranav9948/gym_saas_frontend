'use client'

import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, UserCheck, Users, Users2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { membersService } from '@/services'
import { queryKeys } from '@/services/queryKeys'
import { StatusType } from '@/types'

const PAGE_SIZE = 10

function formatJoinedDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default function OwnerMembersPage() {
  const queryClient = useQueryClient()
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [addOpen, setAddOpen] = React.useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.members.list({ page, limit: PAGE_SIZE }),
    queryFn: () => membersService.getMembers({ page, limit: PAGE_SIZE }),
  })

  const members = data?.members ?? []
  const total = data?.meta.total ?? 0
  const totalPages = data?.meta.totalPages ?? 1

  const filtered = members.filter((m) => {
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

  const activeCount = members.filter((m) => m.status === 'ACTIVE').length

  const handleAdded = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Manage gym members, staff, and trainers."
        actions={
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add person</span>
          </Button>
        }
      />

      <AddPersonDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={handleAdded}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total Members" value={String(total)} icon={Users} />
        <StatCard label="Active on page" value={String(activeCount)} icon={UserCheck} />
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

          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <EmptyState
              icon={<Users2 className="size-8 text-muted-foreground" />}
              title="Could not load members"
              description="Check your connection and try again."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Users2 className="size-8 text-muted-foreground" />}
              title="No members found"
              description={
                query
                  ? 'Try adjusting your search.'
                  : 'Add your first member, staff, or trainer to get started.'
              }
              action={
                !query ? (
                  <Button onClick={() => setAddOpen(true)} className="gap-2">
                    <Plus className="size-4" />
                    Add person
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
                    {filtered.map((m) => (
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
                              <StatusBadge status={m.status.toLowerCase() as StatusType} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{m.email}</TableCell>
                        <TableCell className="text-muted-foreground">{m.phone ?? '—'}</TableCell>
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
                            <Button variant="ghost" size="icon" aria-label="View member">
                              <Eye className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Edit member">
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
    </div>
  )
}
