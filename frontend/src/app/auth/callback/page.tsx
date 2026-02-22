'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken /*, fetchUser*/ } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setToken(token)
      // fetchUser will be triggered automatically by the token-change effect
      // in the auth hook; wait a tick and then redirect
      router.replace('/')
    } else {
      // no token ? send back to login
      router.replace('/login')
    }
  }, [searchParams, router, setToken])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Connexion en cours...</p>
    </div>
  )
}
