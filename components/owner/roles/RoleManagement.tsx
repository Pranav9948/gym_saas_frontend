'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  EmptyState,
  LoadingSpinner,
  PageHeader,
  ConfirmDialog,
} from '@/components/common'
import { RoleFormDialog } from '@/components/owner/roles/RoleFormDialog'
import { rbacService, tenantService, queryKeys } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { ROLE_DESCRIPTIONS } from '@/constants/roles'
import type { RoleDto } from '@/types/rbac'
import type { TenantRole } from '@/types'
import { StatCard } from '@/components/common/StatCard'

interface RoleManagementProps {
  /** When true, hides the standalone page header (used inside Settings tabs). */
  embedded?: boolean
}

function groupPermissionLabel(name: string) {
  return name.split(':')[0] ?? name
}

function getRoleDescription(name: string) {
  const key = name.toUpperCase() as TenantRole
  return ROLE_DESCRIPTIONS[key] ?? 'Custom role with selected permissions'
}

function RoleTypeBadge({ role }: { role: RoleDto }) {
  if (role.isProtected) {
    return <Badge className="bg-primary/15 text-primary border-none">Protected</Badge>
  }
  if (role.isSystem) {
    return <Badge variant="secondary">System</Badge>
  }
  return <Badge variant="outline">Custom</Badge>
}

export function RoleManagement({ embedded = false }: RoleManagementProps) {
  const { toast } = useToast()
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingRole, setEditingRole] = React.useState<RoleDto | null>(null)
  const [deletingRole, setDeletingRole] = React.useState<RoleDto | null>(null)
  const [viewingRole, setViewingRole] = React.useState<RoleDto | null>(null)
  const [search, setSearch] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)

  const tenantQuery = useQuery({
    queryKey: queryKeys.tenant.current(),
    queryFn: () => tenantService.getTenant(),
  })

  const tenantId = tenantQuery.data?.data.id

  const permissionsQuery = useQuery({
    queryKey: queryKeys.rbac.permissions(),
    queryFn: () => rbacService.getPermissions(),
  })

  const rolesQuery = useQuery({
    queryKey: queryKeys.rbac.roles(tenantId ?? 'unknown'),
    queryFn: () => rbacService.getRoles(tenantId!),
    enabled: Boolean(tenantId),
  })

  const handleDelete = async () => {
    if (!deletingRole || !tenantId) return

    setIsDeleting(true)
    try {
      await rbacService.deleteRole(tenantId, deletingRole.id)
      toast({
        title: 'Role deleted',
        description: `"${deletingRole.name}" was removed.`,
      })
      setDeletingRole(null)
      await rolesQuery.refetch()
    } catch (error) {
      toast({
        title: 'Could not delete role',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const openCreate = () => {
    setEditingRole(null)
    setFormOpen(true)
  }

  const openEdit = (role: RoleDto) => {
    setEditingRole(role)
    setFormOpen(true)
  }

  const isLoading =
    tenantQuery.isLoading ||
    permissionsQuery.isLoading ||
    rolesQuery.isLoading

  const roles = rolesQuery.data?.data ?? []
  const permissions = permissionsQuery.data?.data ?? []

  const filteredRoles = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return roles
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.permissions.some((p) => p.name.toLowerCase().includes(query)),
    )
  }, [roles, search])

  const customRoleCount = roles.filter((r) => !r.isSystem).length
  const totalMembers = roles.reduce((sum, r) => sum + r.userCount, 0)

  const createButton = (
    <Button className="gap-2" onClick={openCreate} disabled={!tenantId}>
      <Plus className="size-4" />
      Create role
    </Button>
  )

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      {!embedded ? (
        <PageHeader
          title="Roles & Permissions"
          description="Create custom roles and control what each team member can do."
          actions={createButton}
        />
      ) : null}

      <RoleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tenantId={tenantId}
        permissions={permissions}
        role={editingRole}
        onSuccess={() => rolesQuery.refetch()}
      />

      <ConfirmDialog
        open={Boolean(deletingRole)}
        title="Delete role?"
        description={
          deletingRole
            ? `This will permanently delete "${deletingRole.name}". Users must be reassigned before deletion.`
            : undefined
        }
        confirmText="Delete role"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingRole(null)}
      />

      <Sheet open={Boolean(viewingRole)} onOpenChange={(open) => !open && setViewingRole(null)}>
        <SheetContent className="flex w-full flex-col sm:max-w-md px-4">
          <SheetHeader>
            <SheetTitle>{viewingRole?.name}</SheetTitle>
            <SheetDescription>
              {viewingRole ? getRoleDescription(viewingRole.name) : ''}
            </SheetDescription>
          </SheetHeader>
          {viewingRole ? (
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              <div className="flex flex-wrap gap-2">
                <RoleTypeBadge role={viewingRole} />
                <Badge variant="outline">{viewingRole.userCount} members</Badge>
                <Badge variant="outline">
                  {viewingRole.permissions.length} permissions
                </Badge>
              </div>
              <div className="space-y-3">
                {Object.entries(
                  viewingRole.permissions.reduce<Record<string, typeof viewingRole.permissions>>(
                    (groups, permission) => {
                      const moduleName = groupPermissionLabel(permission.name)
                      if (!groups[moduleName]) groups[moduleName] = []
                      groups[moduleName].push(permission)
                      return groups
                    },
                    {},
                  ),
                ).map(([moduleName, modulePermissions]) => (
                  <div key={moduleName} className="rounded-lg border border-border p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {moduleName}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {modulePermissions.map((permission) => (
                        <Badge key={permission.id} variant="secondary" className="font-normal">
                          {permission.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      {!isLoading && roles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total roles"
            value={String(roles.length)}
            icon={Shield}
            hint={`${customRoleCount} custom`}
          />
          <StatCard
            label="Permission modules"
            value={String([...new Set(permissions.map((p) => groupPermissionLabel(p.name)))].length)}
            icon={Shield}
          />
          <StatCard
            label="Team members assigned"
            value={String(totalMembers)}
            icon={Users}
          />
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              {embedded ? 'Roles & Permissions' : 'Tenant roles'}
            </CardTitle>
            <CardDescription>
              System roles are built-in and can have permissions updated. Custom roles can be
              fully created, edited, and deleted.
            </CardDescription>
          </div>
          {embedded ? createButton : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.length > 0 ? (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search roles or permissions..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
          ) : null}

          {isLoading ? (
            <LoadingSpinner />
          ) : rolesQuery.isError || tenantQuery.isError ? (
            <EmptyState
              title="Could not load roles"
              description="Check your connection and try again. You may need to log out and back in."
              action={
                <Button variant="outline" onClick={() => rolesQuery.refetch()}>
                  Retry
                </Button>
              }
            />
          ) : filteredRoles.length === 0 && roles.length === 0 ? (
            <EmptyState
              icon={<Shield className="size-12 opacity-40" />}
              title="No roles yet"
              description="Roles define what your team can do. Create a custom role or wait for system roles to be seeded for your gym."
              action={
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="size-4" />
                  Create your first role
                </Button>
              }
            />
          ) : filteredRoles.length === 0 ? (
            <EmptyState
              title="No matching roles"
              description={`Nothing matches "${search}". Try a different search term.`}
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="hidden sm:table-cell">Members</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="min-w-[180px]">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{role.name}</span>
                            <RoleTypeBadge role={role} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getRoleDescription(role.name)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-md flex-wrap items-center gap-1.5">
                          {role.permissions.slice(0, 4).map((permission) => (
                            <Badge
                              key={permission.id}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {permission.name}
                            </Badge>
                          ))}
                          {role.permissions.length > 4 ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => setViewingRole(role)}
                            >
                              +{role.permissions.length - 4} more
                            </Button>
                          ) : null}
                          {role.permissions.length === 0 ? (
                            <span className="text-xs text-muted-foreground">No permissions</span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {role.userCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hidden sm:inline-flex"
                            aria-label={`View ${role.name}`}
                            onClick={() => setViewingRole(role)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Actions for ${role.name}`}>
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewingRole(role)}>
                                <Eye className="size-4" />
                                View permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={role.isProtected}
                                onClick={() => openEdit(role)}
                              >
                                <Pencil className="size-4" />
                                Edit role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={role.isSystem || role.userCount > 0}
                                variant="destructive"
                                onClick={() => setDeletingRole(role)}
                              >
                                <Trash2 className="size-4" />
                                Delete role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && roles.length > 0 ? (
            <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Protected roles cannot be deleted. System roles cannot be removed but permissions
                can be updated. Custom roles with assigned members must be unassigned first.
              </p>
              {!embedded ? null : (
                <Button variant="outline" size="sm" className="shrink-0 gap-2" onClick={openCreate}>
                  <Plus className="size-4" />
                  Add another role
                </Button>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
