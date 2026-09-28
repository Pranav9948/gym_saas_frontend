'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dumbbell, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks'
import { CollapsibleSidebar, SidebarHeaderRow } from '@/components/layout/CollapsibleSidebar'
import { navGroups } from './nav-items'

function isItemActive(pathname: string, href: string) {
  if (href === '/super-admin') return pathname === '/super-admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <SidebarHeaderRow>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="size-5" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">GymFlow</p>
            <p className="truncate text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </SidebarHeaderRow>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 pb-1 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => {
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
                        : 'text-muted-foreground hover:bg-sidebar-accent/5 hover:text-sidebar-foreground',
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
          ))}
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

export function SuperAdminSidebar() {
  return (
    <CollapsibleSidebar>
      <SidebarContent />
    </CollapsibleSidebar>
  )
}
