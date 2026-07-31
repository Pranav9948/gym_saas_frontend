'use client'

import React from 'react'
import { Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GymBrandProps {
  name?: string
  logoUrl?: string | null
  subtitle?: string
  className?: string
  iconClassName?: string
}

export function GymBrand({
  name = 'My Gym',
  logoUrl,
  subtitle,
  className,
  iconClassName,
}: GymBrandProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground',
          iconClassName,
        )}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={`${name} logo`} className="size-full object-cover" />
        ) : (
          <Dumbbell className="size-5" />
        )}
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold text-sidebar-foreground">{name}</p>
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}
