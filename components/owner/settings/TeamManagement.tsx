'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  Mail,
  Send,
  UserPlus,
  Users,
  Clock,
  X,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { FormField, EmptyState, LoadingSpinner } from '@/components/common'
import { tenantService, queryKeys } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks'
import { ApiException } from '@/lib/api/errors'
import {
  directCreateTeamMemberSchema,
  inviteUserSchema,
  type DirectCreateTeamMemberFormData,
  type InviteUserFormData,
} from '@/schemas/settings.schema'
import { INVITABLE_ROLES, ROLE_LABELS } from '@/constants/roles'
import type { InviteRole, TenantRole } from '@/types'

interface TeamManagementProps {
  embedded?: boolean
}

function RoleBadge({ role }: { role: TenantRole | InviteRole }) {
  const label = ROLE_LABELS[role as TenantRole] ?? role
  const variant =
    role === 'OWNER' ? 'default' : role === 'ADMIN' ? 'secondary' : 'outline'

  return <Badge variant={variant}>{label}</Badge>
}

export function TeamManagement({ embedded = false }: TeamManagementProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()

  const teamQuery = useQuery({
    queryKey: queryKeys.tenant.team(),
    queryFn: () => tenantService.listTeamMembers(),
  })

  const invitesQuery = useQuery({
    queryKey: queryKeys.tenant.invites(),
    queryFn: () => tenantService.listPendingInvites(),
  })

  const invalidateTeam = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.team() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.invites() }),
    ])
  }

  const inviteForm = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'STAFF',
    },
  })

  const createForm = useForm<DirectCreateTeamMemberFormData>({
    resolver: zodResolver(directCreateTeamMemberSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'STAFF',
      password: '',
      confirmPassword: '',
    },
  })

  const inviteMutation = useMutation({
    mutationFn: (data: InviteUserFormData) => tenantService.inviteUser(data),
    onSuccess: (_result, variables) => {
      toast({
        title: 'Invite sent',
        description: `We emailed ${variables.email} a link to join your team.`,
      })
      inviteForm.reset({ email: '', firstName: '', lastName: '', role: 'STAFF' })
      void invalidateTeam()
    },
    onError: (error) => {
      toast({
        title: 'Could not send invite',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: DirectCreateTeamMemberFormData) =>
      tenantService.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        password: data.password,
      }),
    onSuccess: (_result, variables) => {
      toast({
        title: 'Staff created',
        description: `${variables.firstName} ${variables.lastName} can log in immediately.`,
      })
      createForm.reset({
        email: '',
        firstName: '',
        lastName: '',
        role: 'STAFF',
        password: '',
        confirmPassword: '',
      })
      void invalidateTeam()
    },
    onError: (error) => {
      toast({
        title: 'Could not create staff',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const cancelInviteMutation = useMutation({
    mutationFn: (inviteId: string) => tenantService.cancelInvite(inviteId),
    onSuccess: () => {
      toast({ title: 'Invite cancelled' })
      void invalidateTeam()
    },
    onError: (error) => {
      toast({
        title: 'Could not cancel invite',
        description:
          error instanceof ApiException
            ? error.getUserMessage()
            : 'Something went wrong.',
        variant: 'destructive',
      })
    },
  })

  const members = teamQuery.data?.data ?? []
  const invites = invitesQuery.data?.data ?? []
  const isLoading = teamQuery.isLoading || invitesQuery.isLoading

  const onInviteSubmit = inviteForm.handleSubmit((data) => {
    inviteMutation.mutate(data)
  })

  const onCreateSubmit = createForm.handleSubmit((data) => {
    createMutation.mutate(data)
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading team..." />
  }

  return (
    <div className="space-y-6">
      {!embedded ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team</h2>
          <p className="text-sm text-muted-foreground">
            Invite admins and staff by email, or create accounts with a password.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4 text-primary" />
              Invite team member
            </CardTitle>
            <CardDescription>
              Send an email invite. They set their password when accepting the link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onInviteSubmit} className="space-y-4">
              <FormField
                name="email"
                control={inviteForm.control}
                label="Email"
                type="email"
                placeholder="name@example.com"
                error={inviteForm.formState.errors.email?.message}
                disabled={inviteMutation.isPending}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="firstName"
                  control={inviteForm.control}
                  label="First name"
                  error={inviteForm.formState.errors.firstName?.message}
                  disabled={inviteMutation.isPending}
                />
                <FormField
                  name="lastName"
                  control={inviteForm.control}
                  label="Last name"
                  error={inviteForm.formState.errors.lastName?.message}
                  disabled={inviteMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Role</label>
                <Select
                  value={inviteForm.watch('role')}
                  onValueChange={(value) =>
                    inviteForm.setValue('role', value as InviteRole, {
                      shouldValidate: true,
                    })
                  }
                  disabled={inviteMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVITABLE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {inviteForm.formState.errors.role?.message ? (
                  <p className="text-xs text-destructive">
                    {inviteForm.formState.errors.role.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                className="w-full gap-2 sm:w-auto"
                loading={inviteMutation.isPending}
              >
                <Send className="size-4" />
                Send invite
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="size-4 text-primary" />
              Create staff directly
            </CardTitle>
            <CardDescription>
              Create an account with a password so they can log in right away.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreateSubmit} className="space-y-4">
              <FormField
                name="email"
                control={createForm.control}
                label="Email"
                type="email"
                placeholder="name@example.com"
                error={createForm.formState.errors.email?.message}
                disabled={createMutation.isPending}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="firstName"
                  control={createForm.control}
                  label="First name"
                  error={createForm.formState.errors.firstName?.message}
                  disabled={createMutation.isPending}
                />
                <FormField
                  name="lastName"
                  control={createForm.control}
                  label="Last name"
                  error={createForm.formState.errors.lastName?.message}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Role</label>
                <Select
                  value={createForm.watch('role')}
                  onValueChange={(value) =>
                    createForm.setValue('role', value as InviteRole, {
                      shouldValidate: true,
                    })
                  }
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVITABLE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.role?.message ? (
                  <p className="text-xs text-destructive">
                    {createForm.formState.errors.role.message}
                  </p>
                ) : null}
              </div>
              <FormField
                name="password"
                control={createForm.control}
                label="Password"
                type="password"
                error={createForm.formState.errors.password?.message}
                disabled={createMutation.isPending}
              />
              <FormField
                name="confirmPassword"
                control={createForm.control}
                label="Confirm password"
                type="password"
                error={createForm.formState.errors.confirmPassword?.message}
                disabled={createMutation.isPending}
              />
              <Button
                type="submit"
                className="w-full gap-2 sm:w-auto"
                loading={createMutation.isPending}
              >
                <UserPlus className="size-4" />
                Create staff
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4 text-primary" />
            Team members
          </CardTitle>
          <CardDescription>
            People with access to your gym dashboard ({members.length}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <EmptyState
              title="No team members yet"
              description="Invite someone or create a staff account to get started."
            />
          ) : (
            <div className="overflow-x-auto rounded-md border">
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
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.firstName} {member.lastName}
                        {member.userId === currentUser?.id ? (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (you)
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={member.role} />
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

      {invites.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-primary" />
              Pending invites
            </CardTitle>
            <CardDescription>
              Invitations waiting to be accepted ({invites.length}).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[80px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">
                        {invite.firstName} {invite.lastName}
                      </TableCell>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={invite.role} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(invite.expiresAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Cancel invite"
                          disabled={cancelInviteMutation.isPending}
                          onClick={() => cancelInviteMutation.mutate(invite.id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
