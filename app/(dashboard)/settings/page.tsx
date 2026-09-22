'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bell, Building2, MapPin, User } from 'lucide-react'
import { LoadingSpinner } from '@/components/common'
import {
  StaffModeCards,
  StaffPageHeader,
  personInitials,
} from '@/components/staff/staff-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks'
import { cn } from '@/lib/utils'
import type { Tenant, TenantRole } from '@/types'

const SETTINGS_TABS = ['account', 'gym', 'notifications'] as const
type SettingsTab = (typeof SETTINGS_TABS)[number]

function isSettingsTab(value: string | null): value is SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab)
}

function displayValue(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : '—'
}

function formatJoinedDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function gymLocation(tenant: Tenant) {
  return [tenant.city, tenant.state, tenant.country].filter(Boolean).join(', ')
}

function Detail({
  label,
  value,
  className,
}: {
  label: string
  value?: string | null
  className?: string
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-foreground">
        {displayValue(value)}
      </dd>
    </div>
  )
}

function StaffSettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, tenant } = useAuth()
  const tabParam = searchParams.get('tab')
  const activeTab: SettingsTab = isSettingsTab(tabParam) ? tabParam : 'account'
  const roleLabel =
    user?.role && user.role in ROLE_LABELS
      ? ROLE_LABELS[user.role as TenantRole]
      : user?.role

  const handleTabChange = (value: SettingsTab) => {
    if (value === 'account') {
      router.replace('/settings', { scroll: false })
      return
    }
    router.replace(`/settings?tab=${value}`, { scroll: false })
  }

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Settings"
        description="Your account, gym details, and notification preferences."
      />

      <StaffModeCards
        value={activeTab}
        onChange={handleTabChange}
        options={[
          {
            value: 'account',
            kicker: 'You',
            title: 'Account',
            description: 'Your staff login, name, and role.',
            icon: User,
            accent: 'primary',
          },
          {
            value: 'gym',
            kicker: 'Gym',
            title: 'Gym details',
            description: 'Name, contact, and location of this gym.',
            icon: Building2,
            accent: 'sky',
          },
          {
            value: 'notifications',
            kicker: 'Alerts',
            title: 'Notifications',
            description: 'Where emails for this gym are sent.',
            icon: Bell,
            accent: 'violet',
          },
        ]}
      />

      {activeTab === 'account' ? (
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your staff login and role at this gym.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
                  {personInitials(user?.firstName, user?.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                {roleLabel ? (
                  <Badge variant="secondary" className="mt-2">
                    {roleLabel}
                  </Badge>
                ) : null}
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail
                label="Full name"
                value={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
              />
              <Detail label="Email" value={user?.email} />
              <Detail label="Role" value={roleLabel} />
              <Detail label="Gym" value={tenant?.name} />
            </dl>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'gym' ? (
        <Card className="overflow-hidden border-sky-500/25">
          <div className="border-b border-sky-500/20 bg-sky-500/10 px-4 py-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Gym
            </p>
            <h2 className="text-base font-semibold">Gym details</h2>
            <p className="text-sm text-muted-foreground">
              Contact and location for the gym you work at. Only the owner can change these.
            </p>
          </div>
          <CardContent className="space-y-6 px-4 pt-5 sm:px-6">
            {tenant ? (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-500/15 text-sky-700 dark:text-sky-400">
                    {tenant.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tenant.logoUrl}
                        alt={`${tenant.name} logo`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Building2 className="size-7" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">{tenant.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {tenant.slug ? `/${tenant.slug}` : 'No public slug'}
                    </p>
                    {gymLocation(tenant) ? (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="truncate">{gymLocation(tenant)}</span>
                      </p>
                    ) : null}
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Detail label="Gym name" value={tenant.name} />
                  <Detail label="Slug" value={tenant.slug} />
                  <Detail label="Contact email" value={tenant.contactEmail} />
                  <Detail label="Phone" value={tenant.contactPhone} />
                  <Detail label="Address" value={tenant.address} className="sm:col-span-2" />
                  <Detail label="City" value={tenant.city} />
                  <Detail label="State" value={tenant.state} />
                  <Detail label="Country" value={tenant.country} />
                  <Detail label="Timezone" value={tenant.timezone} />
                  <Detail
                    label="Gym since"
                    value={formatJoinedDate(tenant.createdAt)}
                  />
                </dl>
              </>
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <Building2 className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">Gym details are not loaded yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Refresh this page, or log out and log back in, so we can load the gym
                  name, contact, and location.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'notifications' ? (
        <Card className="overflow-hidden border-violet-500/25">
          <div className="border-b border-violet-500/20 bg-violet-500/10 px-4 py-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
              Alerts
            </p>
            <h2 className="text-base font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Emails related to this gym are sent to your staff account.
            </p>
          </div>
          <CardContent className="space-y-3 px-4 pt-5 sm:px-6">
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm font-medium">Account email</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {user?.email ?? 'No email on file'}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              The gym owner is notified when you mark a member payment as paid.
              Member check-ins stay on the attendance page for the team to see.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

export default function StaffSettingsPage() {
  return (
    <React.Suspense fallback={<LoadingSpinner label="Loading settings…" />}>
      <StaffSettingsContent />
    </React.Suspense>
  )
}
