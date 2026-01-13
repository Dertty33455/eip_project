import type {
  Book,
  Conversation,
  Message,
  Order,
  PaymentMethod,
  Report,
  User,
} from '../types'
import { nowISO } from '../lib/format'
import { readJson, writeJson } from '../lib/storage'
import {
  demoBooks,
  demoConversations,
  demoMessages,
  demoOrders,
  demoReports,
  demoUsers,
} from '../data/mockSeed'

type Db = {
  users: User[]
  books: Book[]
  favoritesByUserId: Record<string, string[]>
  conversations: Conversation[]
  messages: Message[]
  orders: Order[]
  reports: Report[]
}

const DB_KEY = 'bookmarket_db_v1'

function seedDb(): Db {
  return {
    users: demoUsers,
    books: demoBooks,
    favoritesByUserId: { u_buyer_1: ['b_3'] },
    conversations: demoConversations,
    messages: demoMessages,
    orders: demoOrders,
    reports: demoReports,
  }
}

function loadDb(): Db {
  return readJson<Db>(DB_KEY, seedDb())
}

function saveDb(db: Db) {
  writeJson(DB_KEY, db)
}

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export const mockApi = {
  async login(params: { identifier: string }): Promise<User> {
    await delay()
    const db = loadDb()
    const id = params.identifier.trim().toLowerCase()
    const user = db.users.find(
      (u) => u.email?.toLowerCase() === id || u.phone?.toLowerCase() === id,
    )
    if (!user) {
      const created: User = {
        id: uid('u'),
        role: 'user',
        isBlocked: false,
        displayName: id.includes('@') ? id.split('@')[0] : 'Utilisateur',
        email: id.includes('@') ? id : undefined,
        phone: id.includes('@') ? undefined : params.identifier,
        location: '',
        joinedAtISO: nowISO(),
      }
      db.users.unshift(created)
      saveDb(db)
      return created
    }
    if (user.isBlocked) throw new Error('Compte bloqué. Contactez le support.')
    return user
  },

  async updateProfile(userId: string, patch: Partial<User>): Promise<User> {
    await delay()
    const db = loadDb()
    const idx = db.users.findIndex((u) => u.id === userId)
    if (idx < 0) throw new Error('Utilisateur introuvable')
    db.users[idx] = { ...db.users[idx], ...patch }
    saveDb(db)
    return db.users[idx]
  },

  async listBooks(): Promise<Book[]> {
    await delay()
    const db = loadDb()
    return db.books
  },

  async getBook(bookId: string): Promise<Book | undefined> {
    await delay()
    const db = loadDb()
    return db.books.find((b) => b.id === bookId)
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
    await delay()
    const db = loadDb()
    const seller = db.users.find((u) => u.id === params.sellerUserId)
    if (!seller) throw new Error('Vendeur introuvable')
    const book: Book = {
      id: uid('b'),
      title: params.title,
      author: params.author,
      category: params.category,
      description: params.description,
      priceXof: params.priceXof,
      condition: params.condition,
      status: 'Disponible',
      location: params.location,
      photos: params.photos,
      seller: {
        id: seller.id,
        displayName: seller.displayName,
        rating: 4.5,
        reviewsCount: 0,
        location: seller.location,
      },
      publishedAtISO: nowISO(),
      views: 0,
      favoritesCount: 0,
    }
    db.books.unshift(book)
    saveDb(db)
    return book
  },

  async updateBook(bookId: string, patch: Partial<Book>): Promise<Book> {
    await delay()
    const db = loadDb()
    const idx = db.books.findIndex((b) => b.id === bookId)
    if (idx < 0) throw new Error('Livre introuvable')
    db.books[idx] = { ...db.books[idx], ...patch }
    saveDb(db)
    return db.books[idx]
  },

  async deleteBook(bookId: string): Promise<void> {
    await delay()
    const db = loadDb()
    db.books = db.books.filter((b) => b.id !== bookId)
    saveDb(db)
  },

  async getFavorites(userId: string): Promise<string[]> {
    await delay()
    const db = loadDb()
    return db.favoritesByUserId[userId] ?? []
  },

  async toggleFavorite(userId: string, bookId: string): Promise<string[]> {
    await delay()
    const db = loadDb()
    const current = new Set(db.favoritesByUserId[userId] ?? [])
    if (current.has(bookId)) current.delete(bookId)
    else current.add(bookId)
    db.favoritesByUserId[userId] = Array.from(current)
    saveDb(db)
    return db.favoritesByUserId[userId]
  },

  async listConversations(userId: string): Promise<Conversation[]> {
    await delay()
    const db = loadDb()
    return db.conversations
      .filter((c) => c.buyerUserId === userId || c.sellerUserId === userId)
      .sort((a, b) => b.lastMessageAtISO.localeCompare(a.lastMessageAtISO))
  },

  async listMessages(conversationId: string): Promise<Message[]> {
    await delay()
    const db = loadDb()
    return db.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO))
  },

  async getOrCreateConversation(params: {
    bookId: string
    buyerUserId: string
    sellerUserId: string
  }): Promise<Conversation> {
    await delay(200)
    const db = loadDb()
    const existing = db.conversations.find(
      (c) =>
        c.bookId === params.bookId &&
        c.buyerUserId === params.buyerUserId &&
        c.sellerUserId === params.sellerUserId,
    )
    if (existing) return existing

    const conv: Conversation = {
      id: uid('c'),
      bookId: params.bookId,
      buyerUserId: params.buyerUserId,
      sellerUserId: params.sellerUserId,
      lastMessageAtISO: nowISO(),
      unreadCountByUserId: { [params.buyerUserId]: 0, [params.sellerUserId]: 0 },
    }
    db.conversations.unshift(conv)
    saveDb(db)
    return conv
  },

  async sendMessage(params: {
    conversationId: string
    senderUserId: string
    text: string
  }): Promise<Message> {
    await delay(120)
    const db = loadDb()
    const conv = db.conversations.find((c) => c.id === params.conversationId)
    if (!conv) throw new Error('Conversation introuvable')
    const msg: Message = {
      id: uid('m'),
      conversationId: params.conversationId,
      senderUserId: params.senderUserId,
      text: params.text,
      createdAtISO: nowISO(),
    }
    db.messages.push(msg)
    conv.lastMessageAtISO = msg.createdAtISO
    const otherId =
      conv.buyerUserId === params.senderUserId
        ? conv.sellerUserId
        : conv.buyerUserId
    conv.unreadCountByUserId[otherId] =
      (conv.unreadCountByUserId[otherId] ?? 0) + 1
    saveDb(db)
    return msg
  },

  async markConversationRead(params: {
    conversationId: string
    userId: string
  }): Promise<void> {
    await delay(80)
    const db = loadDb()
    const conv = db.conversations.find((c) => c.id === params.conversationId)
    if (!conv) return
    conv.unreadCountByUserId[params.userId] = 0
    saveDb(db)
  },

  async createOrder(params: {
    bookId: string
    buyerUserId: string
    paymentMethod: PaymentMethod
  }): Promise<Order> {
    await delay(250)
    const db = loadDb()
    const book = db.books.find((b) => b.id === params.bookId)
    if (!book) throw new Error('Livre introuvable')
    const order: Order = {
      id: uid('o'),
      bookId: book.id,
      buyerUserId: params.buyerUserId,
      sellerUserId: book.seller.id,
      amountXof: book.priceXof,
      paymentMethod: params.paymentMethod,
      status: 'En cours',
      createdAtISO: nowISO(),
    }
    db.orders.unshift(order)
    book.status = 'Réservé'
    saveDb(db)
    return order
  },

  async listOrders(userId: string): Promise<Order[]> {
    await delay()
    const db = loadDb()
    return db.orders
      .filter((o) => o.buyerUserId === userId || o.sellerUserId === userId)
      .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO))
  },

  async listUsers(): Promise<User[]> {
    await delay()
    const db = loadDb()
    return db.users
  },

  async setUserRole(userId: string, role: User['role']): Promise<User> {
    await delay()
    const db = loadDb()
    const idx = db.users.findIndex((u) => u.id === userId)
    if (idx < 0) throw new Error('Utilisateur introuvable')
    db.users[idx] = { ...db.users[idx], role }
    saveDb(db)
    return db.users[idx]
  },

  async setUserBlocked(userId: string, isBlocked: boolean): Promise<User> {
    await delay()
    const db = loadDb()
    const idx = db.users.findIndex((u) => u.id === userId)
    if (idx < 0) throw new Error('Utilisateur introuvable')
    db.users[idx] = { ...db.users[idx], isBlocked }
    saveDb(db)
    return db.users[idx]
  },

  async listReports(): Promise<Report[]> {
    await delay()
    const db = loadDb()
    return db.reports.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO))
  },

  async resolveReport(reportId: string): Promise<void> {
    await delay()
    const db = loadDb()
    const idx = db.reports.findIndex((r) => r.id === reportId)
    if (idx < 0) return
    db.reports[idx] = { ...db.reports[idx], status: 'Traité' }
    saveDb(db)
  },

  async createReport(params: {
    target: Report['target']
    targetId: string
    reason: string
  }): Promise<Report> {
    await delay()
    const db = loadDb()
    const report: Report = {
      id: uid('r'),
      target: params.target,
      targetId: params.targetId,
      reason: params.reason,
      createdAtISO: nowISO(),
      status: 'Ouvert',
    }
    db.reports.unshift(report)
    saveDb(db)
    return report
  },
}
