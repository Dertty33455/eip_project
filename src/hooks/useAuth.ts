'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  phone?: string
  firstName: string
  lastName: string
  username: string
  avatar?: string
  bio?: string
  location?: string
  country?: string
  role: 'USER' | 'SELLER' | 'ADMIN'
  status: string
  isVerifiedSeller: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: string
  updatedAt: string
}

interface Wallet {
  id: string
  balance: number
  currency: string
}

interface Subscription {
  id: string
  plan: string
  status: string
  endDate: string
}

interface AuthState {
  user: User | null
  wallet: Wallet | null
  subscription: Subscription | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setWallet: (wallet: Wallet | null) => void
  setSubscription: (subscription: Subscription | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      wallet: null,
      subscription: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setWallet: (wallet) => set({ wallet }),
      setSubscription: (subscription) => set({ subscription }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => set({ user: null, wallet: null, subscription: null }),
    }),
    {
      name: 'afribook-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

export function useAuth() {
  const { user, wallet, subscription, isLoading, setUser, setWallet, setSubscription, setLoading, clearAuth } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setWallet(data.user?.wallet)
        setSubscription(data.subscription)
      } else {
        clearAuth()
      }
    } catch (error) {
      console.error('Fetch user error:', error)
      clearAuth()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      setUser(data.user)
      toast.success('Connexion réussie!')
      return { success: true }
    } catch (error: any) {
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    username: string
    phone?: string
  }) => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur d\'inscription')
      }

      setUser(data.user)
      toast.success('Compte créé avec succès!')
      return { success: true }
    } catch (error: any) {
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      clearAuth()
      toast.success('Déconnexion réussie')
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Erreur de mise à jour')
      }

      setUser(result.user)
      toast.success('Profil mis à jour!')
      return { success: true }
    } catch (error: any) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const refreshWallet = async () => {
    try {
      const res = await fetch('/api/wallet')
      if (res.ok) {
        const data = await res.json()
        setWallet(data.wallet)
      }
    } catch (error) {
      console.error('Refresh wallet error:', error)
    }
  }

  return {
    user: mounted ? user : null,
    wallet: mounted ? wallet : null,
    subscription: mounted ? subscription : null,
    isLoading: !mounted || isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshWallet,
    refreshUser: fetchUser,
  }
}
