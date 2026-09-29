'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { resolveMediaUrl } from '@/lib/helpers/media'
import { cn } from '@/lib/utils'
import type { TrainerOverview } from '@/types'
import { Dumbbell, Mail, Users } from 'lucide-react'

const COVERS = [
  'from-violet-500 via-fuchsia-500 to-pink-500',
  'from-sky-500 via-cyan-500 to-teal-500',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-indigo-500 via-blue-500 to-sky-500',
  'from-rose-500 via-pink-500 to-orange-400',
] as const

function coverClass(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % COVERS.length
  }
  return COVERS[hash] ?? COVERS[0]
}

function initials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || 'TR'
}

export function TrainerCard({
  trainer,
  onOpen,
}: {
  trainer: TrainerOverview
  onOpen: () => void
}) {
  const name = `${trainer.user.firstName} ${trainer.user.lastName}`.trim()
  const photo = resolveMediaUrl(trainer.user.avatarUrl)
  const members = trainer.members ?? []
  const extraMembers = Math.max(0, members.length - 3)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="relative h-36 overflow-hidden">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              'flex size-full items-center justify-center bg-gradient-to-br',
              coverClass(name),
            )}
          >
            <Dumbbell className="size-12 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <Badge className="absolute right-3 top-3 border-0 bg-white/90 text-foreground shadow-sm">
          {trainer.user.isActive ? 'Active' : 'Inactive'}
        </Badge>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="truncate text-lg font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-white/80">
            {trainer.specialization || 'No specialization yet'}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="inline-flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <Mail className="size-3.5 shrink-0" />
          {trainer.user.email}
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {trainer.bio || 'No bio yet'}
        </p>

        <div className="mt-auto space-y-3 border-t border-border/70 pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-3.5" />
              {trainer.assignedMemberCount} member
              {trainer.assignedMemberCount === 1 ? '' : 's'}
            </p>
            {members.length > 0 ? (
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="size-7 border-2 border-card">
                    <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">
                      {initials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {extraMembers > 0 ? (
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium">
                    +{extraMembers}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          <Button className="w-full" variant="secondary" onClick={onOpen}>
            View performance
          </Button>
        </div>
      </div>
    </article>
  )
}
