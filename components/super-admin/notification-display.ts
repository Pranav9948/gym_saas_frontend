import {
  Building2,
  CreditCard,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type { SuperAdminNotificationType } from '@/types'

export const notificationTypeMeta: Record<
  SuperAdminNotificationType,
  { label: string; icon: LucideIcon; className: string }
> = {
  GYM_JOINED: {
    label: 'New gym',
    icon: Building2,
    className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  },
  PAYMENT_JOINED: {
    label: 'Join payment',
    icon: CreditCard,
    className: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  },
  SUBSCRIPTION_RENEWED: {
    label: 'Renewal',
    icon: RefreshCw,
    className: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  },
  PASSWORD_RESET: {
    label: 'Password reset',
    icon: KeyRound,
    className: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  },
  PASSWORD_UPDATED: {
    label: 'Password updated',
    icon: ShieldCheck,
    className: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  },
}

export function notificationMeta(type: string) {
  return (
    notificationTypeMeta[type as SuperAdminNotificationType] ?? {
      label: type,
      icon: Building2,
      className: 'bg-muted text-muted-foreground ring-border',
    }
  )
}
