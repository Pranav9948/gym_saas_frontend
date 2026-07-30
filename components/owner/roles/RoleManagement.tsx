'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Pencil,
  Plus,
  Shield,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import type { RoleDto } from '@/types/rbac'

function groupPermissionLabel(name: string) {
  return name.split(':')[0] ?? name
}

export function RoleManagement() {
  const { toast } = useToast()
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingRole, setEditingRole] = React.useState<RoleDto | null>(null)
  const [deletingRole, setDeletingRole] = React.useState<RoleDto | null>(null)
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Create custom roles and control what each team member can do."
        actions={
          <Button className="gap-2" onClick={openCreate} disabled={!tenantId}>
            <Plus className="size-4" />
            Create role
          </Button>
        }
      />

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
            ? `This will permanently delete "${deletingRole.name}". This action cannot be undone.`
            : undefined
        }
        confirmText="Delete role"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingRole(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            Tenant roles
          </CardTitle>
          <CardDescription>
            System roles are built-in. Custom roles can be fully managed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : rolesQuery.isError || tenantQuery.isError ? (
            <EmptyState
              title="Could not load roles"
              description="Check your connection and try again."
            />
          ) : roles.length === 0 ? (
            <EmptyState
              title="No roles yet"
              description="Create a custom role to assign granular permissions."
              action={
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="size-4" />
                  Create role
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{role.name}</span>
                            {role.isSystem ? (
                              <Badge variant="secondary">System</Badge>
                            ) : (
                              <Badge variant="outline">Custom</Badge>
                            )}
                            {role.isProtected ? (
                              <Badge variant="outline">Protected</Badge>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-xl flex-wrap gap-1.5">
                          {role.permissions.slice(0, 6).map((permission) => (
                            <Badge
                              key={permission.id}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {permission.name}
                            </Badge>
                          ))}
                          {role.permissions.length > 6 ? (
                            <Badge variant="secondary" className="text-xs">
                              +{role.permissions.length - 6} more
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {role.userCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${role.name}`}
                            disabled={role.isProtected}
                            onClick={() => openEdit(role)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${role.name}`}
                            disabled={role.isSystem || role.userCount > 0}
                            onClick={() => setDeletingRole(role)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && permissions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Permission modules</CardTitle>
            <CardDescription>
              Available permission groups:{' '}
              {[...new Set(permissions.map((p) => groupPermissionLabel(p.name)))].join(', ')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  )
}
