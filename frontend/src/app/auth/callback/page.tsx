'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
// use window.location to avoid server-side navigation during prerender
import { useAuth } from '@/hooks/useAuth'

export default function AuthCallbackPage() {
  // Avoid next/navigation on this small client-only callback to prevent prerender/runtime issues
  const { setToken /*, fetchUser*/ } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const token = params.get('token')
    if (token) {
      setToken(token)
      // fetchUser will be triggered by the auth hook; redirect using window.location
      window.location.replace('/')
    } else {
      // no token ? send back to login
      window.location.replace('/login')
    }
  }, [setToken])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Connexion en cours...</p>
    </div>
  )
}
