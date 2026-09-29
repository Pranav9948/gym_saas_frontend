const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/$/, '')

export function resolveMediaUrl(url?: string | null) {
  if (!url) return null
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url
  }
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`
}
