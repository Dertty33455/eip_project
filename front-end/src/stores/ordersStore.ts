import { create } from 'zustand'
import type { Order, PaymentMethod } from '../types'
import { mockApi } from '../api/mockApi'

type OrdersState = {
  orders: Order[]
  isLoading: boolean
  error: string | null

  fetchOrders: (userId: string) => Promise<void>
  createOrder: (params: {
    bookId: string
    buyerUserId: string
    paymentMethod: PaymentMethod
  }) => Promise<Order | null>
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  async fetchOrders(userId) {
    set({ isLoading: true, error: null })
    try {
      const orders = await mockApi.listOrders(userId)
      set({ orders, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },

  async createOrder(params) {
    set({ isLoading: true, error: null })
    try {
      const order = await mockApi.createOrder(params)
      set({ orders: [order, ...get().orders], isLoading: false })
      return order
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
      return null
    }
  },
}))
