'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ClipboardCheck } from 'lucide-react'
import { PageHeader, EmptyState, LoadingSpinner } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { staffAttendanceService } from '@/services'
import { queryKeys } from '@/services/queryKeys'
import { ApiException } from '@/lib/api/errors'
import { useToast } from '@/hooks/use-toast'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function OwnerStaffPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [range, setRange] = React.useState<'this_month' | 'last_month' | 'custom'>(
    'this_month',
  )
  const [from, setFrom] = React.useState('')
  const [to, setTo] = React.useState('')
  const [markDate, setMarkDate] = React.useState(todayIso())

  const metricsQuery = useQuery({
    queryKey: queryKeys.staffAttendance.metrics({ range, from, to }),
    queryFn: () =>
      staffAttendanceService.getMetrics({
        range,
        from: range === 'custom' ? from : undefined,
        to: range === 'custom' ? to : undefined,
      }),
  })

  const markMutation = useMutation({
    mutationFn: (userId: string) =>
      staffAttendanceService.mark({
        userId,
        date: markDate,
        present: true,
      }),
    onSuccess: () => {
      toast({ title: 'Attendance marked', description: `Present on ${markDate}.` })
      void queryClient.invalidateQueries({ queryKey: queryKeys.staffAttendance.all })
    },
    onError: (error) => {
      toast({
        title: 'Could not mark attendance',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Please try again.',
        variant: 'destructive',
      })
    },
  })

  const data = metricsQuery.data?.data
  const staff = data?.staff ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff attendance"
        description="Track days present for staff and admins by month or a custom date range."
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={range} onValueChange={(value) => setRange(value as typeof range)}>
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
                  <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
                </div>
              </>
            ) : null}
            <div className="space-y-2">
              <Label>Mark present on</Label>
              <Input
                type="date"
                value={markDate}
                onChange={(event) => setMarkDate(event.target.value)}
              />
            </div>
          </div>

          {metricsQuery.isLoading ? (
            <LoadingSpinner />
          ) : metricsQuery.isError ? (
            <EmptyState
              icon={<ClipboardCheck className="size-8 text-muted-foreground" />}
              title="Could not load staff attendance"
              description="Check your connection and try again."
            />
          ) : staff.length === 0 ? (
            <EmptyState
              icon={<ClipboardCheck className="size-8 text-muted-foreground" />}
              title="No staff yet"
              description="Create staff or admins from People, then mark days they worked."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Days present</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((person) => (
                  <TableRow key={person.userId}>
                    <TableCell>
                      <div className="font-medium">
                        {person.firstName} {person.lastName}
                      </div>
                      <p className="text-sm text-muted-foreground">{person.email}</p>
                    </TableCell>
                    <TableCell>{person.role}</TableCell>
                    <TableCell className="font-semibold">{person.daysPresent}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {data?.from} → {data?.to} ({data?.totalDaysInRange} days)
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={markMutation.isPending}
                        onClick={() => markMutation.mutate(person.userId)}
                      >
                        Mark present
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
