import { create } from 'zustand'
import type { Book, BookCondition, BookStatus } from '../types'
import { api } from '../api/api'

export type BookSort = 'Date' | 'Prix' | 'Popularité'

export type BooksFilters = {
  query: string
  category: string
  condition: '' | BookCondition
  location: string
  priceMin: string
  priceMax: string
  sort: BookSort
}

type MarketState = {
  books: Book[]
  isLoading: boolean
  error: string | null
  favorites: string[]

  fetchBooks: () => Promise<void>
  fetchFavorites: (userId: string) => Promise<void>
  toggleFavorite: (userId: string, bookId: string) => Promise<void>

  publishBook: (params: {
    sellerUserId: string
    title: string
    author: string
    category: string
    description: string
    priceXof: number
    condition: BookCondition
    location: string
    photos: string[]
  }) => Promise<Book | null>

  updateBook: (bookId: string, patch: Partial<Book>) => Promise<void>
  deleteBook: (bookId: string) => Promise<void>
  setBookStatus: (bookId: string, status: BookStatus) => Promise<void>
}

export const useMarketStore = create<MarketState>((set, get) => ({
  books: [],
  isLoading: false,
  error: null,
  favorites: [],

  async fetchBooks() {
    set({ isLoading: true, error: null })
    try {
      const books = await api.listBooks()
      set({ books, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },

  async fetchFavorites(userId) {
    try {
      const favorites = await api.getFavorites(userId)
      set({ favorites })
    } catch {
      set({ favorites: [] })
    }
  },

  async toggleFavorite(userId, bookId) {
    const favorites = await api.toggleFavorite(userId, bookId)
    set({ favorites })
  },

  async publishBook(params) {
    set({ isLoading: true, error: null })
    try {
      const created = await api.publishBook(params)
      set({ books: [created, ...get().books], isLoading: false })
      return created
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
      return null
    }
  },

  async updateBook(bookId, patch) {
    const updated = await api.updateBook(bookId, patch)
    set({ books: get().books.map((b) => (b.id === bookId ? updated : b)) })
  },

  async deleteBook(bookId) {
    await api.deleteBook(bookId)
    set({ books: get().books.filter((b) => b.id !== bookId) })
  },

  async setBookStatus(bookId, status) {
    const updated = await api.updateBook(bookId, { status })
    set({ books: get().books.map((b) => (b.id === bookId ? updated : b)) })
  },
}))
