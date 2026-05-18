import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute({
  children,
  requiredRole?: string,
}: {
    children: React.ReactNode
  requiredRole?: string
}) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard') // Redirect to home if no access
      return
    }
  }, [isAuthenticated, user, requiredRole, router])

  if (!isAuthenticated) {
    return <LoadingSpinner /> // Show spinner while checking
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}