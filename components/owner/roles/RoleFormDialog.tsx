'use client'

import React from 'react'
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

function groupPermissions(permissions: PermissionDto[]) {
  return permissions.reduce<Record<string, PermissionDto[]>>((groups, permission) => {
    const module = permission.name.split(':')[0] ?? 'other'
    if (!groups[module]) {
      groups[module] = []
    }
    groups[module].push(permission)
    return groups
  }, {})
}

function formatModuleLabel(module: string) {
  return module.charAt(0).toUpperCase() + module.slice(1)
}

export function RoleFormDialog({
  open,
  onOpenChange,
  tenantId,
  permissions,
  role,
  onSuccess,
}: RoleFormDialogProps) {
  const { toast } = useToast()
  const isEditing = Boolean(role)
  const [name, setName] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!open) return

    setName(role?.name ?? '')
    setSelectedIds(role?.permissions.map((p) => p.id) ?? [])
  }, [open, role])

  const grouped = React.useMemo(
    () => groupPermissions(permissions),
    [permissions],
  )

  const togglePermission = (permissionId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, permissionId])]
        : current.filter((id) => id !== permissionId),
    )
  }

  const toggleGroup = (module: string, checked: boolean) => {
    const moduleIds = grouped[module]?.map((p) => p.id) ?? []
    setSelectedIds((current) => {
      if (checked) {
        return [...new Set([...current, ...moduleIds])]
      }
      return current.filter((id) => !moduleIds.includes(id))
    })
  }

  const isGroupFullySelected = (module: string) => {
    const moduleIds = grouped[module]?.map((p) => p.id) ?? []
    return moduleIds.length > 0 && moduleIds.every((id) => selectedIds.includes(id))
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
          description: `"${trimmedName}" is ready to assign.`,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{isEditing ? 'Edit role' : 'Create role'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update permissions for this role. System role names cannot be changed.'
              : 'Define a custom role and choose exactly what it can access.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-6 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role name</Label>
              <Input
                id="roleName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Gym Manager"
                disabled={isSubmitting || Boolean(role?.isSystem)}
              />
              {role?.isSystem ? (
                <p className="text-xs text-muted-foreground">
                  System role names are fixed.
                </p>
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Permissions</p>
                <p className="text-xs text-muted-foreground">
                  Grouped by module. Use select all for quick assignment.
                </p>
              </div>

              {Object.entries(grouped).map(([module, modulePermissions]) => (
                <div
                  key={module}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`group-${module}`}
                        checked={isGroupFullySelected(module)}
                        onCheckedChange={(checked) =>
                          toggleGroup(module, checked === true)
                        }
                      />
                      <Label htmlFor={`group-${module}`} className="font-medium">
                        {formatModuleLabel(module)}
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {modulePermissions.filter((p) => selectedIds.includes(p.id)).length}
                      /{modulePermissions.length} selected
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {modulePermissions.map((permission) => (
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
              ))}
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
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
      </DialogContent>
    </Dialog>
  )
}
