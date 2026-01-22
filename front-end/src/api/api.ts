import type {
  Book,
  Conversation,
  Message,
  Order,
  PaymentMethod,
  Report,
  User,
} from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token')

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  async register(params: {
    email?: string
    phone?: string
    password: string
    displayName: string
  }): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email: params.email,
        phone: params.phone,
        password: params.password,
        display_name: params.displayName,
      }),
    })
    // Store token
    localStorage.setItem('auth_token', response.token)
    return response
  },

  async login(params: { identifier: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: params.identifier,
        password: params.password,
      }),
    })
    // Store token
    localStorage.setItem('auth_token', response.token)
    return response
  },

  async logout(): Promise<void> {
    await apiRequest('/api/logout', { method: 'POST' })
    localStorage.removeItem('auth_token')
  },

  async updateProfile(userId: string, patch: Partial<User>): Promise<User> {
    return apiRequest(`/api/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    })
  },

  async listBooks(): Promise<Book[]> {
    return apiRequest('/api/books')
  },

  async getBook(bookId: string): Promise<Book> {
    return apiRequest(`/api/books/${bookId}`)
  },

  async publishBook(params: {
    sellerUserId: string
    title: string
    author: string
    category: string
    description: string
    priceXof: number
    condition: Book['condition']
    location: string
    photos: string[]
  }): Promise<Book> {
    return apiRequest('/api/books', {
      method: 'POST',
      body: JSON.stringify({
        seller_user_id: params.sellerUserId,
        title: params.title,
        author: params.author,
        category: params.category,
        description: params.description,
        price_xof: params.priceXof,
        condition: params.condition,
        location: params.location,
        photos: params.photos,
      }),
    })
  },

  async updateBook(bookId: string, patch: Partial<Book>): Promise<Book> {
    return apiRequest(`/api/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    })
  },

  async deleteBook(bookId: string): Promise<void> {
    return apiRequest(`/api/books/${bookId}`, {
      method: 'DELETE',
    })
  },

  async getFavorites(userId: string): Promise<string[]> {
    return apiRequest(`/api/users/${userId}/favorites`)
  },

  async toggleFavorite(userId: string, bookId: string): Promise<string[]> {
    return apiRequest(`/api/users/${userId}/favorites/${bookId}/toggle`, {
      method: 'POST',
    })
  },

  async listConversations(userId: string): Promise<Conversation[]> {
    return apiRequest(`/api/users/${userId}/conversations`)
  },

  async listMessages(conversationId: string): Promise<Message[]> {
    return apiRequest(`/api/conversations/${conversationId}/messages`)
  },

  async getOrCreateConversation(params: {
    bookId: string
    buyerUserId: string
    sellerUserId: string
  }): Promise<Conversation> {
    return apiRequest('/api/conversations/get-or-create', {
      method: 'POST',
      body: JSON.stringify({
        book_id: params.bookId,
        buyer_user_id: params.buyerUserId,
        seller_user_id: params.sellerUserId,
      }),
    })
  },

  async sendMessage(params: {
    conversationId: string
    senderUserId: string
    text: string
  }): Promise<Message> {
    return apiRequest('/api/messages', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  async markConversationRead(params: {
    conversationId: string
    userId: string
  }): Promise<void> {
    return apiRequest(`/api/conversations/${params.conversationId}/mark-read`, {
      method: 'POST',
      body: JSON.stringify({ user_id: params.userId }),
    })
  },

  async createOrder(params: {
    bookId: string
    buyerUserId: string
    paymentMethod: PaymentMethod
  }): Promise<Order> {
    return apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        book_id: params.bookId,
        buyer_user_id: params.buyerUserId,
        payment_method: params.paymentMethod,
      }),
    })
  },

  async listOrders(userId: string): Promise<Order[]> {
    return apiRequest(`/api/users/${userId}/orders`)
  },

  async listUsers(): Promise<User[]> {
    return apiRequest('/api/admin/users')
  },

  async setUserRole(userId: string, role: User['role']): Promise<User> {
    return apiRequest(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  },

  async setUserBlocked(userId: string, isBlocked: boolean): Promise<User> {
    return apiRequest(`/api/admin/users/${userId}/blocked`, {
      method: 'PUT',
      body: JSON.stringify({ is_blocked: isBlocked }),
    })
  },

  async listReports(): Promise<Report[]> {
    return apiRequest('/api/admin/reports')
  },

  async resolveReport(reportId: string): Promise<void> {
    return apiRequest(`/api/admin/reports/${reportId}/resolve`, {
      method: 'POST',
    })
  },

  async createReport(params: {
    target: Report['target']
    targetId: string
    reason: string
  }): Promise<Report> {
    return apiRequest('/api/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },
}