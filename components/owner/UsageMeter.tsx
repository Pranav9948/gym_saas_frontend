import { cn } from '@/lib/utils'

interface UsageMeterProps {
  label: string
  current: number
  max: number | null
  isUnlimited?: boolean
  /** override the auto threshold color */
  tone?: 'primary' | 'success' | 'warning' | 'destructive'
  className?: string
}

function toneClass(tone: NonNullable<UsageMeterProps['tone']>) {
  switch (tone) {
    case 'success':
      return 'bg-success'
    case 'warning':
      return 'bg-warning'
    case 'destructive':
      return 'bg-destructive'
    default:
      return 'bg-primary'
  }
}

export function UsageMeter({
  label,
  current,
  max,
  isUnlimited = false,
  tone,
  className,
}: UsageMeterProps) {
  const unlimited = isUnlimited || max === null
  const pct =
    !unlimited && max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0
  const autoTone: NonNullable<UsageMeterProps['tone']> =
    pct >= 90 ? 'destructive' : pct >= 70 ? 'warning' : 'success'
  const resolvedTone = tone ?? autoTone

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {unlimited ? `${current} / Unlimited` : `${current} / ${max}`}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={unlimited ? current : max ?? 0}
        aria-label={label}
      >
        <div
          className={cn('h-full rounded-full transition-all', toneClass(resolvedTone))}
          style={{ width: unlimited ? '100%' : `${pct}%` }}
        />
      </div>
    </div>
  )
}
