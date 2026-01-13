import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
