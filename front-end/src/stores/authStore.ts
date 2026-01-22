import { create } from 'zustand'
import type { User } from '../types'
import { api } from '../api/api'
import { readJson, writeJson } from '../lib/storage'

type AuthState = {
  user: User | null
  isLoading: boolean
  error: string | null

  register: (params: { email?: string; phone?: string; password: string; displayName: string }) => Promise<void>
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (patch: Partial<User>) => Promise<void>
}

const AUTH_KEY = 'bookmarket_auth_v1'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: readJson<User | null>(AUTH_KEY, null),
  isLoading: false,
  error: null,

  async register(params) {
    set({ isLoading: true, error: null })
    try {
      const response = await api.register(params)
      writeJson(AUTH_KEY, response.user)
      set({ user: response.user, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },

  async login(identifier, password) {
    set({ isLoading: true, error: null })
    try {
      const response = await api.login({ identifier, password })
      writeJson(AUTH_KEY, response.user)
      set({ user: response.user, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },

  async logout() {
    try {
      await api.logout()
    } catch (e) {
      // Ignore logout errors
    }
    writeJson(AUTH_KEY, null)
    set({ user: null })
  },

  async updateProfile(patch) {
    const current = get().user
    if (!current) return
    set({ isLoading: true, error: null })
    try {
      const updated = await api.updateProfile(current.id, patch)
      writeJson(AUTH_KEY, updated)
      set({ user: updated, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },
}))
