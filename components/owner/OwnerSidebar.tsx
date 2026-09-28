'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useOwnerTenant } from '@/hooks/useOwnerTenant'
import { PortalSwitcher } from '@/components/layout/PortalSwitcher'
import { CollapsibleSidebar, SidebarHeaderRow } from '@/components/layout/CollapsibleSidebar'
import { GymBrand } from '@/components/owner/GymBrand'
import { ownerNavItems } from './owner-nav-items'
import { ROUTES } from '@/config'

function isItemActive(pathname: string, href: string) {
  if (href === ROUTES.OWNER_DASHBOARD) {
    return pathname === ROUTES.OWNER_DASHBOARD || pathname === '/owner'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { tenant } = useOwnerTenant()

  return (
    <div className="flex h-full flex-col">
      <SidebarHeaderRow>
        <GymBrand
          name={tenant?.name}
          logoUrl={tenant?.logoUrl}
          subtitle="Owner Portal"
        />
      </SidebarHeaderRow>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {ownerNavItems.map((item) => {
            const Icon = item.icon
            const active = isItemActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {active ? (
                  <span className="absolute left-0 h-5 w-1 -translate-x-3 rounded-r-full bg-primary" />
                ) : null}
                <Icon className="size-4.5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <PortalSwitcher />
      </div>

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="size-4.5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export function OwnerSidebar() {
  return (
    <CollapsibleSidebar>
      <SidebarContent />
    </CollapsibleSidebar>
  )
}
