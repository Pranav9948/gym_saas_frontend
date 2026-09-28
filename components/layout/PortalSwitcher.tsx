'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Dumbbell, Shield, Users } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { ROUTES } from '@/config'
import { useAuth } from '@/hooks'
import { useToast } from '@/hooks/use-toast'
import { tenantService } from '@/services'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import type { Tenant } from '@/types'

type PortalId = 'owner' | 'staff' | 'trainer' | 'member' | 'super-admin'

const PORTALS: Array<{
  id: PortalId
  label: string
  description: string
  href: string
  icon: typeof Users
  roles: string[]
  flag?: keyof Pick<
    Tenant,
    'staffPortalEnabled' | 'trainerPortalEnabled' | 'memberPortalEnabled'
  >
}> = [
  {
    id: 'owner',
    label: 'Owner',
    description: 'Gym, billing, and team',
    href: ROUTES.OWNER_DASHBOARD,
    icon: Building2,
    roles: ['OWNER'],
  },
  {
    id: 'staff',
    label: 'Staff',
    description: 'Front desk and members',
    href: ROUTES.DASHBOARD,
    icon: Users,
    roles: ['STAFF', 'ADMIN'],
    flag: 'staffPortalEnabled',
  },
  {
    id: 'trainer',
    label: 'Trainer',
    description: 'Assigned members and plans',
    href: ROUTES.TRAINER_MEMBERS,
    icon: Dumbbell,
    roles: ['TRAINER'],
    flag: 'trainerPortalEnabled',
  },
  {
    id: 'member',
    label: 'Member',
    description: 'Member self-service',
    href: ROUTES.MEMBER_PORTAL,
    icon: Users,
    roles: ['MEMBER', 'CLIENT'],
    flag: 'memberPortalEnabled',
  },
  {
    id: 'super-admin',
    label: 'Super admin',
    description: 'Platform controls',
    href: ROUTES.SUPER_ADMIN,
    icon: Shield,
    roles: ['SUPER_ADMIN'],
  },
]

function isPortalEnabled(portal: (typeof PORTALS)[number], tenant: Tenant | null) {
  if (!portal.flag) return true
  return tenant?.[portal.flag] !== false
}

function currentPortal(pathname: string): PortalId | null {
  if (pathname.startsWith('/owner')) return 'owner'
  if (pathname.startsWith('/trainer')) return 'trainer'
  if (pathname.startsWith('/member')) return 'member'
  if (pathname.startsWith('/super-admin')) return 'super-admin'
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/members') ||
    pathname.startsWith('/trainers') ||
    pathname.startsWith('/attendance') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/billing') ||
    pathname.startsWith('/analytics')
  ) {
    return 'staff'
  }
  return null
}

export function PortalSwitcher() {
  const pathname = usePathname()
  const { user, tenant } = useAuth()
  const setTenant = useAuthStore((state) => state.setTenant)
  const { toast } = useToast()
  const [pending, setPending] = React.useState<PortalId | null>(null)
  const active = currentPortal(pathname)

  if (user?.role !== 'OWNER') {
    return null
  }

  const togglePortal = async (
    flag: NonNullable<(typeof PORTALS)[number]['flag']>,
    enabled: boolean,
    id: PortalId,
  ) => {
    if (!tenant) return
    setPending(id)
    try {
      const response = await tenantService.updateTenant({ [flag]: enabled })
      if (response.data) {
        setTenant({ ...tenant, ...response.data })
      }
      toast({
        title: enabled ? 'Portal turned on' : 'Portal turned off',
        description: enabled
          ? 'That team can use this workspace again.'
          : 'People in that role will see a closed-portal message.',
      })
    } catch {
      toast({
        title: 'Could not update portals',
        description: 'Try again in a moment.',
        variant: 'destructive',
      })
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="space-y-2">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Portals
      </p>
      <div className="space-y-1.5">
        {PORTALS.filter((portal) => portal.id !== 'super-admin' || user?.role === 'SUPER_ADMIN').map(
          (portal) => {
            const Icon = portal.icon
            const enabled = isPortalEnabled(portal, tenant)
            const canEnter = portal.roles.includes(user?.role ?? '') && enabled
            const isCurrent = active === portal.id

            return (
              <div
                key={portal.id}
                className={cn(
                  'rounded-lg border px-2.5 py-2',
                  isCurrent
                    ? 'border-primary/30 bg-primary/8'
                    : 'border-border/70 bg-background/40',
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    {canEnter ? (
                      <Link
                        href={portal.href}
                        className="block text-sm font-medium text-foreground hover:underline"
                      >
                        {portal.label}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{portal.label}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground">{portal.description}</p>
                  </div>
                  {portal.flag ? (
                    <Switch
                      size="sm"
                      checked={enabled}
                      disabled={pending === portal.id}
                      onCheckedChange={(checked) =>
                        void togglePortal(portal.flag!, checked, portal.id)
                      }
                      aria-label={`${enabled ? 'Disable' : 'Enable'} ${portal.label} portal`}
                    />
                  ) : null}
                </div>
              </div>
            )
          },
        )}
      </div>
    </div>
  )
}
