import type { SuperAdminOwner } from '@/types'

export function ownerFullName(owner: SuperAdminOwner) {
  return `${owner.firstName} ${owner.lastName}`.trim()
}

export function ownerPhoto(owner: SuperAdminOwner) {
  return owner.avatarUrl || owner.gym.logoUrl
}

export function ownerInitials(owner: SuperAdminOwner) {
  return `${owner.firstName?.[0] ?? ''}${owner.lastName?.[0] ?? ''}`.toUpperCase() || 'OW'
}

export function planLabel(owner: SuperAdminOwner) {
  if (!owner.plan) return 'No plan'
  const name = owner.plan.charAt(0) + owner.plan.slice(1).toLowerCase()
  if (!owner.planInterval) return name
  return `${name} · ${owner.planInterval.toLowerCase()}`
}

export function subscriptionLabel(owner: SuperAdminOwner) {
  if (!owner.plan && owner.daysRemaining == null && !owner.subscriptionEnded) {
    return 'No subscription'
  }
  if (owner.subscriptionEnded) return 'Subscription ended'
  if (owner.daysRemaining == null) return 'No end date'
  if (owner.daysRemaining === 0) return 'Ends today'
  if (owner.daysRemaining === 1) return '1 day left'
  return `${owner.daysRemaining} days left`
}

export function daysCountLabel(days: number | null, empty = '—') {
  if (days == null) return empty
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return `${days} days`
}

export function formatDate(value?: string | null) {
  if (!value) return '—'
  const match = value.match(/\d{4}-\d{2}-\d{2}/)
  const iso = match?.[0] ?? value.slice(0, 10)
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return '—'
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
