'use client'

import React from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

export function useAppSidebar() {
  const open = useUIStore((state) => state.sidebarOpen)
  const toggle = useUIStore((state) => state.toggleSidebar)
  const setOpen = useUIStore((state) => state.setSidebarOpen)
  return { open, toggle, setOpen }
}

export function SidebarToggleButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, toggle } = useAppSidebar()

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('size-9 shrink-0', className)}
      onClick={toggle}
      aria-label={open ? 'Hide sidebar' : 'Show sidebar'}
      aria-expanded={open}
      {...props}
    >
      <Menu className="size-5" />
    </Button>
  )
}

export function SidebarHeaderRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-3">
      <SidebarToggleButton />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function CollapsibleSidebar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { open } = useAppSidebar()

  if (!open) {
    return (
      <aside className="flex h-full w-14 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
          <SidebarToggleButton />
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        'flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar',
        className,
      )}
    >
      {children}
    </aside>
  )
}
