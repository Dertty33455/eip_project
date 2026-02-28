'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileIndexPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // once we know the auth state, redirect accordingly
    if (!isLoading) {
      if (user) {
        router.replace(`/profile/${user.username}`)
      } else {
        const loginUrl = `/login?redirect=/profile`
        router.replace(loginUrl)
      }
    }
  }, [user, isLoading, router])

  return null
}
