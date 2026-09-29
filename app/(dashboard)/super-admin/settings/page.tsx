'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { FormField, LoadingSpinner, PageHeader } from '@/components/common'
import { useAuth, useToast } from '@/hooks'
import { useAuthStore } from '@/store/authStore'
import { superAdminAuthService } from '@/services/super-admin'
import { queryKeys } from '@/services/queryKeys'
import { ApiException } from '@/lib/api/errors'
import { formatDateTime, formatInitials } from '@/lib/helpers/formatting'
import {
  updateSuperAdminPasswordSchema,
  updateSuperAdminProfileSchema,
  type UpdateSuperAdminPasswordFormData,
  type UpdateSuperAdminProfileFormData,
} from '@/schemas/settings.schema'

export default function SuperAdminSettingsPage() {
  const { user } = useAuth()
  const setUser = useAuthStore((state) => state.setUser)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const meQuery = useQuery({
    queryKey: queryKeys.superAdmin.me(),
    queryFn: () => superAdminAuthService.getMe(),
  })

  const profile = meQuery.data?.data
  const firstName = profile?.firstName ?? user?.firstName ?? ''
  const lastName = profile?.lastName ?? user?.lastName ?? ''
  const email = profile?.email ?? user?.email ?? ''
  const initials = formatInitials(firstName, lastName)

  const profileForm = useForm<UpdateSuperAdminProfileFormData>({
    resolver: zodResolver(updateSuperAdminProfileSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  })
  const resetProfileForm = profileForm.reset

  React.useEffect(() => {
    resetProfileForm({
      firstName,
      lastName,
    })
  }, [firstName, lastName, resetProfileForm])

  const passwordForm = useForm<UpdateSuperAdminPasswordFormData>({
    resolver: zodResolver(updateSuperAdminPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const saveProfile = useMutation({
    mutationFn: (data: UpdateSuperAdminProfileFormData) =>
      superAdminAuthService.updateProfile(data),
    onSuccess: (response) => {
      if (user) {
        setUser({
          ...user,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        })
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.me() })
      toast({
        title: 'Profile updated',
        description: 'Your name was saved.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not update profile',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  const savePassword = useMutation({
    mutationFn: (data: UpdateSuperAdminPasswordFormData) =>
      superAdminAuthService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      passwordForm.reset()
      toast({
        title: 'Password updated',
        description: 'Use your new password the next time you sign in.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not update password',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  if (meQuery.isLoading && !profile && !user) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your super admin profile and password."
      />

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your signed-in super admin details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold text-foreground">
                {firstName} {lastName}
              </p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                Super Admin
              </dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Last login
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {formatDateTime(profile?.lastLoginAt)}
              </dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {profile?.isActive === false ? 'Inactive' : 'Active'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update the name shown across the admin console.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={profileForm.handleSubmit((values) => saveProfile.mutate(values))}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                name="firstName"
                control={profileForm.control}
                label="First name"
                error={profileForm.formState.errors.firstName?.message}
              />
              <FormField
                name="lastName"
                control={profileForm.control}
                label="Last name"
                error={profileForm.formState.errors.lastName?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="super-admin-email">Email</Label>
              <Input id="super-admin-email" value={email} disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed from this screen.
              </p>
            </div>
            <Button type="submit" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Use at least 8 characters with upper, lower, number, and a special character.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={passwordForm.handleSubmit((values) => savePassword.mutate(values))}
          >
            <FormField
              name="currentPassword"
              control={passwordForm.control}
              label="Current password"
              type="password"
              error={passwordForm.formState.errors.currentPassword?.message}
            />
            <FormField
              name="newPassword"
              control={passwordForm.control}
              label="New password"
              type="password"
              error={passwordForm.formState.errors.newPassword?.message}
            />
            <FormField
              name="confirmPassword"
              control={passwordForm.control}
              label="Confirm new password"
              type="password"
              error={passwordForm.formState.errors.confirmPassword?.message}
            />
            <Button type="submit" disabled={savePassword.isPending}>
              {savePassword.isPending ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
