'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  EmptyState,
  LoadingSpinner,
  PageHeader,
  StatusBadge,
} from '@/components/common'
import {
  daysCountLabel,
  formatDate,
  ownerFullName,
  ownerInitials,
  ownerPhoto,
  planLabel,
  subscriptionLabel,
} from '@/components/super-admin/owner-display'
import { ROUTES } from '@/config'
import { useOwner } from '@/hooks/super-admin'

export default function SuperAdminOwnerDetailPage() {
  const params = useParams<{ id: string }>()
  const { owner, isLoading, error } = useOwner(params.id)

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoadingSpinner label="Loading owner…" />
      </div>
    )
  }

  if (error || !owner) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" className="gap-2 px-0">
          <Link href={ROUTES.SUPER_ADMIN_OWNERS}>
            <ArrowLeft className="size-4" />
            Back to owners
          </Link>
        </Button>
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="Owner not found"
          description="This owner may have been removed, or the link is invalid."
        />
      </div>
    )
  }

  const photo = ownerPhoto(owner)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="gap-2 px-0">
        <Link href={ROUTES.SUPER_ADMIN_OWNERS}>
          <ArrowLeft className="size-4" />
          Back to owners
        </Link>
      </Button>

      <PageHeader
        title={ownerFullName(owner)}
        description={`${owner.gym.name} · ${owner.email}`}
      />

      <Card>
        <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            {photo ? <AvatarImage src={photo} alt="" /> : null}
            <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
              {ownerInitials(owner)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{ownerFullName(owner)}</h2>
              <StatusBadge
                status={owner.status}
                label={
                  owner.status.charAt(0) + owner.status.slice(1).toLowerCase()
                }
              />
            </div>
            <p className="text-sm text-muted-foreground">{owner.email}</p>
            <p className="text-sm text-muted-foreground">
              {owner.gym.contactPhone || 'No phone on file'}
            </p>
          </div>
          {owner.gym.logoUrl && owner.avatarUrl ? (
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <Avatar className="size-12">
                <AvatarImage src={owner.gym.logoUrl} alt="" />
                <AvatarFallback>GY</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground">Gym logo</p>
                <p className="text-sm font-medium">{owner.gym.name}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact and gym</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              {owner.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              {owner.gym.contactPhone || 'No phone on file'}
            </p>
            <p className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              {owner.gym.name}
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                {owner.gym.address ? `${owner.gym.address}, ` : ''}
                {owner.gym.location}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              {owner.gym.members.toLocaleString()} members
            </p>
            <p className="text-muted-foreground">
              Gym contact email: {owner.gym.contactEmail}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p
              className={
                owner.subscriptionEnded
                  ? 'text-lg font-semibold text-destructive'
                  : 'text-lg font-semibold'
              }
            >
              {subscriptionLabel(owner)}
            </p>
            <p>{planLabel(owner)}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />
              On platform {daysCountLabel(owner.daysOnPlatform).toLowerCase()}
            </p>
            <p className="text-muted-foreground">
              Current period running for{' '}
              {daysCountLabel(owner.daysSubscribed, 'an unknown time').toLowerCase()}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Period start</p>
                <p className="font-medium">{formatDate(owner.currentPeriodStart)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Period end</p>
                <p className="font-medium">{formatDate(owner.currentPeriodEnd)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
