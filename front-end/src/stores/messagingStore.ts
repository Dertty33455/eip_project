import { create } from 'zustand'
import type { Conversation, Message } from '../types'
import { api } from '../api/api'

type MessagingState = {
  conversations: Conversation[]
  messagesByConversationId: Record<string, Message[]>
  activeConversationId: string | null
  isLoading: boolean
  error: string | null

  fetchConversations: (userId: string) => Promise<void>
  setActiveConversation: (conversationId: string | null) => void
  fetchMessages: (conversationId: string) => Promise<void>
  openConversationForBook: (params: {
    bookId: string
    buyerUserId: string
    sellerUserId: string
  }) => Promise<string>
  sendMessage: (params: {
    conversationId: string
    senderUserId: string
    text: string
  }) => Promise<void>
  markRead: (conversationId: string, userId: string) => Promise<void>
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  conversations: [],
  messagesByConversationId: {},
  activeConversationId: null,
  isLoading: false,
  error: null,

  async fetchConversations(userId) {
    set({ isLoading: true, error: null })
    try {
      const conversations = await api.listConversations(userId)
      set({ conversations, isLoading: false })
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message })
    }
  },

  setActiveConversation(conversationId) {
    set({ activeConversationId: conversationId })
  },

  async fetchMessages(conversationId) {
    const messages = await api.listMessages(conversationId)
    set({
      messagesByConversationId: {
        ...get().messagesByConversationId,
        [conversationId]: messages,
      },
    })
  },

  async openConversationForBook(params) {
    const conv = await api.getOrCreateConversation(params)
    const current = get().conversations
    if (!current.find((c) => c.id === conv.id)) {
      set({ conversations: [conv, ...current] })
    }
    set({ activeConversationId: conv.id })
    return conv.id
  },

  async sendMessage(params) {
    const msg = await api.sendMessage(params)
    const existing = get().messagesByConversationId[params.conversationId] ?? []
    set({
      messagesByConversationId: {
        ...get().messagesByConversationId,
        [params.conversationId]: [...existing, msg],
      },
    })
  },

  async markRead(conversationId, userId) {
    await api.markConversationRead({ conversationId, userId })
    set({
      conversations: get().conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              unreadCountByUserId: { ...c.unreadCountByUserId, [userId]: 0 },
            }
          : c,
      ),
    })
  },
}))
