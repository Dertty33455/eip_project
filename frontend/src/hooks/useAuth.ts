'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useApi } from './useApi'

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
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setWallet: (wallet: Wallet | null) => void
  setSubscription: (subscription: Subscription | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      wallet: null,
      subscription: null,
      token: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setWallet: (wallet) => set({ wallet }),
      setSubscription: (subscription) => set({ subscription }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => set({ user: null, wallet: null, subscription: null, token: null }),
    }),
    {
      name: 'BookShell-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

export function useAuth() {
  const { user, wallet, subscription, token, isLoading, setUser, setWallet, setSubscription, setToken, setLoading, clearAuth } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // share API helper with auth actions so the base URL is applied automatically
  const api = useApi()

  useEffect(() => {
    setMounted(true)
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  // whenever the token changes (for example after OAuth callback)
  // fetch the user data again so the store stays in sync
  useEffect(() => {
    if (mounted && token) {
      fetchUser()
    }
  }, [token, mounted])

  const fetchUser = async () => {
    try {
      const { data, error } = await api.get('/api/auth/me')
      if (!error && data) {
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
      const { data, error } = await api.post('/api/auth/login', { email, password })
      if (error) throw new Error(error)

      setUser(data.user)
      setToken(data.token)
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
      const { data, error } = await api.post('/api/auth/register', userData)
      if (error) throw new Error(error)

      setUser(data.user)
      setToken(data.token)
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
      await api.post('/api/auth/logout', {})
      clearAuth()
      toast.success('Déconnexion réussie')
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      // Clear auth even on error
      clearAuth()
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { data: result, error } = await api.patch('/api/auth/me', data)
      if (error) throw new Error(error)

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/wallet`)
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
    token: mounted ? token : null,
    isLoading: !mounted || isLoading,
    isAuthenticated: !!user && !!token,
    setToken,
    fetchUser, // expose for manual calls if ever needed
  
    login,
    register,
    logout,
    updateProfile,
    refreshWallet,
    refreshUser: fetchUser,
  }
}
