'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader, LoadingSpinner } from '@/components/common'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks'
import { useToast } from '@/hooks/use-toast'
import { ApiException } from '@/lib/api/errors'
import { queryKeys } from '@/services'
import { superAdminAuthService } from '@/services/super-admin'
import { useAuthStore } from '@/store/authStore'

function formatDateTime(value?: string | null) {
  if (!value) return 'Never'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

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
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  React.useEffect(() => {
    if (!profile) return
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
  }, [profile])

  const initials = `${(profile?.firstName ?? user?.firstName ?? 'S')[0]}${(profile?.lastName ?? user?.lastName ?? 'A')[0]}`.toUpperCase()

  const saveProfile = useMutation({
    mutationFn: () =>
      superAdminAuthService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
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
        description: 'Your name is saved.',
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
    mutationFn: () =>
      superAdminAuthService.changePassword({
        currentPassword,
        newPassword,
      }),
    onSuccess: (response) => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast({
        title: 'Password updated',
        description:
          response.data.revokedSessions > 0
            ? `Other sessions were signed out (${response.data.revokedSessions}).`
            : 'Use this password the next time you sign in.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not change password',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  const logoutOthers = useMutation({
    mutationFn: () => superAdminAuthService.logoutOtherSessions(),
    onSuccess: (response) => {
      toast({
        title: 'Sessions updated',
        description:
          response.message ??
          (response.data.revokedSessions
            ? `Signed out ${response.data.revokedSessions} other session(s).`
            : 'No other sessions were signed in.'),
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not sign out other sessions',
        description:
          error instanceof ApiException ? error.getUserMessage() : 'Try again.',
        variant: 'destructive',
      })
    },
  })

  const profileChanged =
    firstName.trim() !== (profile?.firstName ?? '') ||
    lastName.trim() !== (profile?.lastName ?? '')

  function onSavePassword(event: React.FormEvent) {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Re-enter the new password in both fields.',
        variant: 'destructive',
      })
      return
    }
    savePassword.mutate()
  }

  if (meQuery.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoadingSpinner label="Loading settings…" />
      </div>
    )
  }

  if (meQuery.isError || !profile) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Could not load your account. Refresh and try again.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Your super-admin profile and account security."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Name is editable. Email is your login and cannot be changed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              saveProfile.mutate()
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  required
                  minLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  required
                  minLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value="Super admin" disabled />
              </div>
              <div className="space-y-2">
                <Label>Last login</Label>
                <Input value={formatDateTime(profile.lastLoginAt)} disabled />
              </div>
              <div className="space-y-2">
                <Label>Account created</Label>
                <Input value={formatDateTime(profile.createdAt)} disabled />
              </div>
            </div>

            <Button type="submit" disabled={saveProfile.isPending || !profileChanged}>
              {saveProfile.isPending ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Change your password and sign out sessions on other devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form className="space-y-4" onSubmit={onSavePassword}>
            <div className="space-y-2 sm:max-w-md">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="grid gap-4 sm:max-w-md sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground sm:max-w-md">
              At least 8 characters, with upper and lower case, a number, and a
              special character. No spaces.
            </p>
            <Button type="submit" disabled={savePassword.isPending}>
              {savePassword.isPending ? 'Updating…' : 'Update password'}
            </Button>
          </form>

          <div className="rounded-xl border p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="font-medium">Other sessions</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Stay signed in here and sign out every other browser or device.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-3 sm:mt-0"
              disabled={logoutOthers.isPending}
              onClick={() => logoutOthers.mutate()}
            >
              {logoutOthers.isPending ? 'Signing out…' : 'Sign out other sessions'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
