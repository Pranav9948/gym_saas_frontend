'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PageHeader, LoadingSpinner } from '@/components/common'
import { RoleManagement } from '@/components/owner/roles/RoleManagement'
import { GymProfileForm } from '@/components/owner/settings/GymProfileForm'
import { TeamManagement } from '@/components/owner/settings/TeamManagement'
import { useAuth } from '@/hooks'

const SETTINGS_TABS = ['gym', 'team', 'roles', 'account'] as const
type SettingsTab = (typeof SETTINGS_TABS)[number]

function isSettingsTab(value: string | null): value is SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab)
}

function OwnerSettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const tabParam = searchParams.get('tab')
  const activeTab: SettingsTab = isSettingsTab(tabParam) ? tabParam : 'gym'

  const handleTabChange = (value: string) => {
    if (value === 'gym') {
      router.replace('/owner/settings', { scroll: false })
      return
    }
    router.replace(`/owner/settings?tab=${value}`, { scroll: false })
  }

  const ownerInitials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'OW'

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your gym profile, team, roles and account." />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="gym">Gym Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="gym">
          <GymProfileForm />
        </TabsContent>

        <TabsContent value="team">
          <TeamManagement embedded />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement embedded />
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your owner account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
                    {ownerInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {user?.firstName} {user?.lastName}
                  </dd>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">{user?.email}</dd>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Role
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">{user?.role}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function OwnerSettingsPage() {
  return (
    <React.Suspense fallback={<LoadingSpinner fullScreen label="Loading settings..." />}>
      <OwnerSettingsContent />
    </React.Suspense>
  )
}
