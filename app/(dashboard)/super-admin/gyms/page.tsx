'use client'

import React from 'react'
import { Building2, Building2Icon, BuildingIcon, MapPin, Plus, Search, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState, PageHeader, StatusBadge } from '@/components/common'
import { gyms } from '@/lib/super-admin-mock'
import { StatusType } from '@/types'
import { StatCard } from '@/components/common/StatCard'

const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
]

export default function SuperAdminGymsPage() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('all')

  const filtered = gyms.filter((gym) => {
    const matchesStatus = status === 'all' || gym.status === status
    const matchesQuery =
      gym.name.toLowerCase().includes(query.toLowerCase()) ||
      gym.owner.toLowerCase().includes(query.toLowerCase()) ||
      gym.location.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  })

  const statusMap: Record<
    "active" | "trial" | "suspended" | "pending",
    StatusType
  > = {
    active: "ACTIVE",
    trial: "PENDING",       // or ACTIVE/INACTIVE, whichever makes sense
    suspended: "BANNED",    // or INACTIVE
    pending: "PENDING",
  };


  const totalMembers = gyms.reduce((sum, gym) => sum + gym.members, 0)
  const activeGyms = gyms.filter((gym) => gym.status === 'active').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gyms"
        description="Manage every gym operating on your platform."
        actions={
          <Button className="gap-2">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add gym</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Gyms" value={gyms.length.toString()} icon={Building2} />
        <StatCard label="Active Gyms" value={activeGyms.toString()} icon={Building2} />
        <StatCard label="Total Members" value={totalMembers.toLocaleString()} icon={Users} />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search gyms, owners, cities..."
                className="pl-9"
                aria-label="Search gyms"
              />
            </div>

            <Tabs value={status} onValueChange={setStatus} className="w-full lg:w-auto">
              <TabsList className="w-full justify-start overflow-x-auto lg:w-auto">
                {filters.map((filter) => (
                  <TabsTrigger key={filter.value} value={filter.value}>
                    {filter.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Building2Icon className="h-8 w-8" />}
              title="No gyms found"
              description="Try adjusting your search or filter to find what you are looking for."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gym</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((gym) => (
                    <TableRow key={gym.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                              {gym.name
                                .split(' ')
                                .slice(0, 2)
                                .map((word) => word[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-foreground">{gym.name}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3" />
                              {gym.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{gym.owner}</TableCell>
                      <TableCell>{gym.plan}</TableCell>
                      <TableCell className="text-right font-mono">
                        {gym.members.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {gym.revenue ? currency(gym.revenue) : '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={statusMap[gym.status]}
                          label={gym.status.charAt(0).toUpperCase() + gym.status.slice(1)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
