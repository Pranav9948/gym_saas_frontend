'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAuthStore, getPersistedAuthSession } from '@/store/authStore'

export type AppTheme = 'dark' | 'light'

/** Apply theme class directly on <html> so it works before/with next-themes. */
export function applyAppTheme(theme: AppTheme) {
  const root = document.documentElement
  root.classList.remove('dark', 'light')
  root.classList.add(theme)
  root.style.colorScheme = theme
}

export function resolveAppTheme(
  pathname: string,
  role?: string | null,
): AppTheme {
  if (pathname.startsWith('/owner') && role === 'OWNER') {
    return 'light'
  }
  return 'dark'
}

export function ThemeSync() {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    let role = user?.role

    if (!role && pathname.startsWith('/owner')) {
      const persisted = getPersistedAuthSession()
      role = persisted.user?.role
    }

    const theme = resolveAppTheme(pathname, role)
    applyAppTheme(theme)
    setTheme(theme)
  }, [pathname, user?.role, isInitialized, setTheme])

  return null
}
