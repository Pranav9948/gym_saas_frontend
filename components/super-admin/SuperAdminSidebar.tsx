'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dumbbell, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useIsMobile } from '@/hooks/use-mobile'
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
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Dumbbell className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">GymFlow</p>
          <p className="text-xs text-muted-foreground">Super Admin</p>
        </div>
      </div>

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
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-3 z-50 bg-card"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        {isOpen ? (
          <div
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        <aside
          className={cn(
            'fixed left-0 top-0 z-50 h-dvh w-72 border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-out',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <SidebarContent onNavigate={() => setIsOpen(false)} />
        </aside>
      </>
    )
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
      <SidebarContent />
    </aside>
  )
}
