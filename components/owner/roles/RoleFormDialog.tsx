'use client'

import React from 'react'
import { Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { rbacService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import type { PermissionDto, RoleDto } from '@/types/rbac'

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId?: string
  permissions: PermissionDto[]
  role?: RoleDto | null
  onSuccess?: () => void
}

type GroupedPermissions = Record<string, PermissionDto[]>

function groupPermissions(permissions: PermissionDto[]): GroupedPermissions {
  return permissions.reduce<GroupedPermissions>((groups, permission) => {
    const groupKey = permission.name.split(':')[0] ?? 'other'
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(permission)
    return groups
  }, {})
}

function filterGroupedPermissions(
  grouped: GroupedPermissions,
  query: string,
): GroupedPermissions {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return grouped
  }

  return Object.fromEntries(
    Object.entries(grouped)
      .map(([groupKey, groupPermissions]) => [
        groupKey,
        groupPermissions.filter(
          (permission) =>
            permission.name.toLowerCase().includes(normalizedQuery) ||
            (permission.description?.toLowerCase().includes(normalizedQuery) ??
              false),
        ),
      ])
      .filter((entry): entry is [string, PermissionDto[]] => entry[1].length > 0),
  )
}

function formatGroupLabel(groupKey: string) {
  return groupKey.charAt(0).toUpperCase() + groupKey.slice(1)
}

interface RoleFormBodyProps {
  tenantId?: string
  permissions: PermissionDto[]
  role?: RoleDto | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function RoleFormBody({
  tenantId,
  permissions,
  role,
  onOpenChange,
  onSuccess,
}: RoleFormBodyProps) {
  const { toast } = useToast()
  const isEditing = Boolean(role)
  const [name, setName] = React.useState(() => role?.name ?? '')
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    () => role?.permissions.map((permission) => permission.id) ?? [],
  )
  const [permissionSearch, setPermissionSearch] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const grouped = React.useMemo(
    () => groupPermissions(permissions),
    [permissions],
  )

  const filteredGrouped = React.useMemo(
    () => filterGroupedPermissions(grouped, permissionSearch),
    [grouped, permissionSearch],
  )

  const togglePermission = (permissionId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, permissionId])]
        : current.filter((id) => id !== permissionId),
    )
  }

  const toggleGroup = (groupKey: string, checked: boolean) => {
    const groupIds = grouped[groupKey]?.map((permission) => permission.id) ?? []
    setSelectedIds((current) => {
      if (checked) {
        return [...new Set([...current, ...groupIds])]
      }
      return current.filter((id) => !groupIds.includes(id))
    })
  }

  const isGroupFullySelected = (groupKey: string) => {
    const groupIds = grouped[groupKey]?.map((permission) => permission.id) ?? []
    return (
      groupIds.length > 0 && groupIds.every((id) => selectedIds.includes(id))
    )
  }

  const selectAll = () => {
    setSelectedIds(permissions.map((permission) => permission.id))
  }

  const clearAll = () => {
    setSelectedIds([])
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!tenantId) {
      toast({
        title: 'Missing tenant',
        description: 'Could not determine your gym context.',
        variant: 'destructive',
      })
      return
    }

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      toast({
        title: 'Invalid role name',
        description: 'Role name must be at least 2 characters.',
        variant: 'destructive',
      })
      return
    }

    if (selectedIds.length === 0) {
      toast({
        title: 'Select permissions',
        description: 'Choose at least one permission for this role.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing && role) {
        await rbacService.updateRole(tenantId, role.id, {
          name: role.isSystem ? undefined : trimmedName,
          permissionIds: selectedIds,
        })
        toast({
          title: 'Role updated',
          description: `"${trimmedName}" was saved successfully.`,
        })
      } else {
        await rbacService.createRole(tenantId, {
          name: trimmedName,
          permissionIds: selectedIds,
        })
        toast({
          title: 'Role created',
          description: `"${trimmedName}" is ready to assign to team members.`,
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: isEditing ? 'Could not update role' : 'Could not create role',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 border-b px-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="roleName">Role name</Label>
          <Input
            id="roleName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Front Desk, Gym Manager"
            disabled={isSubmitting || Boolean(role?.isSystem)}
          />
          {role?.isSystem ? (
            <p className="text-xs text-muted-foreground">
              System role names are fixed.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{selectedIds.length} selected</Badge>
          <Button type="button" variant="outline" size="sm" onClick={selectAll}>
            Select all
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter permissions..."
            value={permissionSearch}
            onChange={(event) => setPermissionSearch(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
        <div className="space-y-4 pr-1">
          {Object.keys(filteredGrouped).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No permissions match your search.
            </p>
          ) : null}

          {(Object.entries(filteredGrouped) as [string, PermissionDto[]][]).map(
            ([groupKey, groupPermissions]) => (
              <div
                key={groupKey}
                className="rounded-lg border border-border p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`group-${groupKey}`}
                      checked={isGroupFullySelected(groupKey)}
                      onCheckedChange={(checked) =>
                        toggleGroup(groupKey, checked === true)
                      }
                    />
                    <Label htmlFor={`group-${groupKey}`} className="font-medium">
                      {formatGroupLabel(groupKey)}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {
                      groupPermissions.filter((permission) =>
                        selectedIds.includes(permission.id),
                      ).length
                    }
                    /{groupPermissions.length}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {groupPermissions.map((permission) => (
                    <label
                      key={permission.id}
                      htmlFor={permission.id}
                      className="flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 hover:bg-muted/40"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedIds.includes(permission.id)}
                        onCheckedChange={(checked) =>
                          togglePermission(permission.id, checked === true)
                        }
                      />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none">
                          {permission.name}
                        </p>
                        {permission.description ? (
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        ) : null}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <DialogFooter className="shrink-0 border-t px-6 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Create role'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function RoleFormDialog({
  open,
  onOpenChange,
  tenantId,
  permissions,
  role,
  onSuccess,
}: RoleFormDialogProps) {
  const formKey = role?.id ?? 'create'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(90vh,720px)] max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl [&>button]:z-10">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>{role ? 'Edit role' : 'Create role'}</DialogTitle>
          <DialogDescription>
            {role
              ? 'Update permissions for this role. System role names cannot be changed.'
              : 'Name your role and select the permissions this team member type should have.'}
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <RoleFormBody
            key={formKey}
            tenantId={tenantId}
            permissions={permissions}
            role={role}
            onOpenChange={onOpenChange}
            onSuccess={onSuccess}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
