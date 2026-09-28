'use client'

import React from 'react'
import { Check, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/helpers/formatting'
import { cn } from '@/lib/utils'
import type { Member } from '@/types'

export function personInitials(first?: string | null, last?: string | null) {
  const value = `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
  return value || '?'
}

export function localDateIso(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDaysIso(iso: string, days: number) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return localDateIso(date)
}

export function formatDaysUntilPayment(remainingDays?: number | null) {
  if (remainingDays == null) return '—'
  if (remainingDays < 0) {
    const days = Math.abs(remainingDays)
    return `${days} day${days === 1 ? '' : 's'} overdue`
  }
  if (remainingDays === 0) return 'Due today'
  return `${remainingDays} day${remainingDays === 1 ? '' : 's'} left`
}

export function isMemberOverdue(member: Pick<Member, 'remainingDays' | 'paymentStatus'>) {
  return (
    member.paymentStatus === 'OVERDUE' ||
    (member.remainingDays != null && member.remainingDays < 0)
  )
}

export function canMarkMemberPaid(member: Member) {
  const remaining = member.remainingDays
  return !(
    member.paymentStatus === 'PAID' &&
    (remaining == null || remaining >= 0)
  )
}

export function PaymentStatusBadge({
  status,
  overdue,
  className,
}: {
  status?: string | null
  overdue?: boolean
  className?: string
}) {
  const value = overdue && status !== 'PAID' ? 'OVERDUE' : (status ?? 'PENDING')

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent font-medium',
        value === 'PAID' && 'bg-success/12 text-success',
        value === 'OVERDUE' && 'bg-destructive/12 text-destructive',
        value === 'PENDING' && 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
        value !== 'PAID' && value !== 'OVERDUE' && value !== 'PENDING' && 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {value === 'PAID' ? 'Paid' : value === 'OVERDUE' ? 'Overdue' : value === 'PENDING' ? 'Pending' : value}
    </Badge>
  )
}

export function DaysLeftChip({
  remainingDays,
  className,
}: {
  remainingDays?: number | null
  className?: string
}) {
  const overdue = remainingDays != null && remainingDays < 0
  const dueSoon =
    remainingDays != null && remainingDays >= 0 && remainingDays <= 3

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
        overdue && 'bg-destructive/12 text-destructive',
        dueSoon && !overdue && 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
        !overdue && !dueSoon && 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {formatDaysUntilPayment(remainingDays)}
    </span>
  )
}

export function StaffPageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-balance sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

const MODE_ACCENTS = {
  primary: {
    icon: 'bg-primary/12 text-primary',
    active: 'border-primary/50 bg-primary/10 ring-2 ring-primary/20',
    idle: 'border-primary/20 bg-primary/5 hover:border-primary/35',
    kicker: 'text-primary',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    active: 'border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/20',
    idle: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/35',
    kicker: 'text-amber-700 dark:text-amber-400',
  },
  sky: {
    icon: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
    active: 'border-sky-500/50 bg-sky-500/10 ring-2 ring-sky-500/20',
    idle: 'border-sky-500/20 bg-sky-500/5 hover:border-sky-500/35',
    kicker: 'text-sky-700 dark:text-sky-400',
  },
  violet: {
    icon: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
    active: 'border-violet-500/50 bg-violet-500/10 ring-2 ring-violet-500/20',
    idle: 'border-violet-500/20 bg-violet-500/5 hover:border-violet-500/35',
    kicker: 'text-violet-700 dark:text-violet-400',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    active: 'border-emerald-500/50 bg-emerald-500/10 ring-2 ring-emerald-500/20',
    idle: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/35',
    kicker: 'text-emerald-700 dark:text-emerald-400',
  },
  rose: {
    icon: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
    active: 'border-rose-500/50 bg-rose-500/10 ring-2 ring-rose-500/20',
    idle: 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/35',
    kicker: 'text-rose-700 dark:text-rose-400',
  },
} as const

export function StaffModeCards<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: Array<{
    value: T
    title: string
    description: string
    icon: LucideIcon
    kicker?: string
    accent?: keyof typeof MODE_ACCENTS
    done?: boolean
    doneLabel?: string
  }>
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'grid gap-3',
        options.length <= 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : options.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : options.length >= 6
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-5',
      )}
    >
      {options.map((option) => {
        const Icon = option.icon
        const accent = MODE_ACCENTS[option.accent ?? 'primary']
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative rounded-xl border p-4 text-left transition-colors',
              active ? accent.active : accent.idle,
              option.done && 'border-emerald-400/50',
            )}
          >
            {option.done ? (
              <span
                className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
                title={option.doneLabel ?? 'Done'}
                aria-label={option.doneLabel ?? 'Done'}
              >
                <Check className="size-4" strokeWidth={3} />
              </span>
            ) : null}
            <div className="flex items-start gap-3 pr-8">
              <div
                className={cn(
                  'flex size-11 shrink-0 items-center justify-center rounded-lg',
                  option.done
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : accent.icon,
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                {option.kicker ? (
                  <p
                    className={cn(
                      'mb-0.5 text-[11px] font-semibold uppercase tracking-wider',
                      option.done
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : accent.kicker,
                    )}
                  >
                    {option.kicker}
                    {option.done ? ' · done' : ''}
                  </p>
                ) : null}
                <p className="font-semibold text-foreground">{option.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {option.done && option.doneLabel
                    ? option.doneLabel
                    : option.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function monthlyPackagePrice(price: number, durationDays: number) {
  if (!durationDays || durationDays <= 0) return price
  return (price * 30) / durationDays
}

export function formatMoney(
  amount: number,
  currency = 'INR',
) {
  return formatCurrency(
    amount,
    currency,
    currency.toUpperCase() === 'INR' ? 'en-IN' : 'en-US',
  )
}

export function PackagePriceSummary({
  name,
  price,
  durationDays,
  currency = 'INR',
}: {
  name?: string
  price: number
  durationDays: number
  currency?: string
}) {
  const monthly = monthlyPackagePrice(price, durationDays)
  return (
    <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
      {name ? (
        <p className="font-medium text-foreground">{name}</p>
      ) : null}
      <p className="text-muted-foreground">
        {formatMoney(price, currency)} for {durationDays} day
        {durationDays === 1 ? '' : 's'}
      </p>
      <p className="font-semibold tabular-nums text-foreground">
        {formatMoney(monthly, currency)}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          / month
        </span>
      </p>
    </div>
  )
}
