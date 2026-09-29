'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { GymBrand } from '@/components/owner/GymBrand'
import { CollapsibleSidebar, SidebarHeaderRow } from '@/components/layout/CollapsibleSidebar'
import { Button } from '@/components/ui/button'
import { TRAINER_NAV_ITEMS } from '@/config/trainer-nav'
import { ROUTES } from '@/config'
import { useAuth } from '@/hooks'
import { cn } from '@/lib/utils'

function isItemActive(pathname: string, href: string) {
  if (href === ROUTES.TRAINER_MEMBERS) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { logout, tenant } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <SidebarHeaderRow>
        <GymBrand
          name={tenant?.name}
          logoUrl={tenant?.logoUrl}
          subtitle="Trainer portal"
        />
      </SidebarHeaderRow>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {TRAINER_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isItemActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
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

export function TrainerSidebar() {
  return (
    <CollapsibleSidebar>
      <SidebarContent />
    </CollapsibleSidebar>
  )
}
