export type BookCondition = 'Neuf' | 'Occasion'

export type BookStatus = 'Disponible' | 'Réservé' | 'Vendu'

export type UserRole = 'user' | 'admin'

export type User = {
  id: string
  role: UserRole
  isBlocked?: boolean
  displayName: string
  email?: string
  phone?: string
  location?: string
  avatarUrl?: string
  joinedAtISO: string
}

export type SellerSummary = {
  id: string
  displayName: string
  rating: number
  reviewsCount: number
  location?: string
}

export type Book = {
  id: string
  title: string
  author: string
  category: string
  description: string
  priceXof: number
  condition: BookCondition
  status: BookStatus
  location: string
  photos: string[]
  seller: SellerSummary
  publishedAtISO: string
  views: number
  favoritesCount: number
}

export type Review = {
  id: string
  reviewerName: string
  rating: number
  comment: string
  createdAtISO: string
}

export type Message = {
  id: string
  conversationId: string
  senderUserId: string
  text: string
  createdAtISO: string
}

export type Conversation = {
  id: string
  bookId: string
  buyerUserId: string
  sellerUserId: string
  lastMessageAtISO: string
  unreadCountByUserId: Record<string, number>
}

export type PaymentMethod = 'Mobile Money' | 'Cash' | 'Carte'

export type OrderStatus = 'En cours' | 'Livré' | 'Terminé' | 'Annulé'

export type Order = {
  id: string
  bookId: string
  buyerUserId: string
  sellerUserId: string
  amountXof: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAtISO: string
}

export type ReportTarget = 'Livre' | 'Utilisateur'

export type Report = {
  id: string
  target: ReportTarget
  targetId: string
  reason: string
  createdAtISO: string
  status: 'Ouvert' | 'Traité'
}
