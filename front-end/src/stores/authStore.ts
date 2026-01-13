import { create } from 'zustand'
import type { User } from '../types'
import { mockApi } from '../api/mockApi'
import { readJson, writeJson } from '../lib/storage'

type AuthState = {
  user: User | null
  isLoading: boolean
  error: string | null

  login: (identifier: string) => Promise<void>
  logout: () => void
  updateProfile: (patch: Partial<User>) => Promise<void>
}

const AUTH_KEY = 'bookmarket_auth_v1'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: readJson<User | null>(AUTH_KEY, null),
  isLoading: false,
  error: null,

  async login(identifier) {
    set({ isLoading: true, error: null })
    try {
      const user = await mockApi.login({ identifier })
      writeJson(AUTH_KEY, user)
      set({ user, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },

  logout() {
    writeJson(AUTH_KEY, null)
    set({ user: null })
  },

  async updateProfile(patch) {
    const current = get().user
    if (!current) return
    set({ isLoading: true, error: null })
    try {
      const updated = await mockApi.updateProfile(current.id, patch)
      writeJson(AUTH_KEY, updated)
      set({ user: updated, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },
}))
