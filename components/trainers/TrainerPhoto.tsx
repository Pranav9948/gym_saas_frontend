'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { resolveMediaUrl } from '@/lib/helpers/media'
import { cn } from '@/lib/utils'

type TrainerPhotoUser = {
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
}

const SIZE_CLASS = {
  sm: 'size-6',
  md: 'size-9',
  lg: 'size-11',
  xl: 'size-20',
} as const

export function trainerInitials(
  first?: string | null,
  last?: string | null,
) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || 'TR'
}

export function trainerDisplayName(
  first?: string | null,
  last?: string | null,
) {
  return `${first ?? ''} ${last ?? ''}`.trim()
}

export function TrainerPhoto({
  user,
  className,
  size = 'md',
}: {
  user?: TrainerPhotoUser | null
  className?: string
  size?: keyof typeof SIZE_CLASS
}) {
  const src = resolveMediaUrl(user?.avatarUrl)
  const name = trainerDisplayName(user?.firstName, user?.lastName)

  return (
    <Avatar className={cn(SIZE_CLASS[size], className)}>
      {src ? <AvatarImage src={src} alt={name || 'Trainer'} /> : null}
      <AvatarFallback
        className={cn(
          'bg-amber-500/15 font-semibold text-amber-700 dark:text-amber-400',
          size === 'xl' ? 'text-lg' : size === 'sm' ? 'text-[9px]' : 'text-xs',
        )}
      >
        {trainerInitials(user?.firstName, user?.lastName)}
      </AvatarFallback>
    </Avatar>
  )
}

export function TrainerChip({
  user,
  subtitle,
  empty = '—',
  className,
  photoSize = 'md',
}: {
  user?: TrainerPhotoUser | null
  subtitle?: string | null
  empty?: string
  className?: string
  photoSize?: keyof typeof SIZE_CLASS
}) {
  const name = trainerDisplayName(user?.firstName, user?.lastName)
  if (!user || !name) {
    return <span className="text-muted-foreground">{empty}</span>
  }

  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <TrainerPhoto user={user} size={photoSize} className="shrink-0" />
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{name}</p>
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

export function TrainerSelectLabel({
  user,
  specialization,
}: {
  user?: TrainerPhotoUser | null
  specialization?: string | null
}) {
  const name = trainerDisplayName(user?.firstName, user?.lastName) || 'Trainer'
  return (
    <span className="flex min-w-0 items-center gap-2">
      <TrainerPhoto user={user} size="sm" className="shrink-0" />
      <span className="truncate">
        {name}
        {specialization ? ` · ${specialization}` : ''}
      </span>
    </span>
  )
}
