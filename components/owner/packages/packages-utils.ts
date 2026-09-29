import { resolveMediaUrl } from '@/lib/helpers/media'

export const DURATION_PRESETS = [
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
  { label: '1 year', days: 365 },
] as const

export const PACKAGE_COVERS = [
  'from-violet-500 via-fuchsia-500 to-pink-500',
  'from-sky-500 via-cyan-500 to-teal-500',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-indigo-500 via-blue-500 to-sky-500',
  'from-rose-500 via-pink-500 to-orange-400',
] as const

export function formatDuration(days: number) {
  if (days === 1) return '1 day'
  if (days % 365 === 0) {
    const years = days / 365
    return years === 1 ? '1 year' : `${years} years`
  }
  if (days % 30 === 0) {
    const months = days / 30
    return months === 1 ? '1 month' : `${months} months`
  }
  return `${days} days`
}

export function packageCoverClass(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % PACKAGE_COVERS.length
  }
  return PACKAGE_COVERS[hash] ?? PACKAGE_COVERS[0]
}

export function perDayPrice(price: number, days: number) {
  if (days <= 0) return null
  return price / days
}

export function resolvePackageImageUrl(url?: string | null) {
  return resolveMediaUrl(url)
}
