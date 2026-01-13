import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/auth" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}
