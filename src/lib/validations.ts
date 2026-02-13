import { z } from 'zod'

// ============================================
// AUTHENTIFICATION
// ============================================

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide').optional(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  username: z
    .string()
    .min(3, 'Username doit avoir au moins 3 caractères')
    .max(30, 'Username trop long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username invalide (lettres, chiffres, _ uniquement)'),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  avatar: z.string().url().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
})

// ============================================
// LIVRES
// ============================================

export const createBookSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  author: z.string().min(1, 'Auteur requis').max(100),
  isbn: z.string().optional(),
  description: z.string().min(10, 'Description requise (min 10 caractères)'),
  price: z.number().positive('Prix doit être positif'),
  originalPrice: z.number().positive().optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE']),
  quantity: z.number().int().positive().default(1),
  location: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'Au moins une image requise'),
  language: z.string().default('Français'),
  publishedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  pages: z.number().int().positive().optional(),
  categoryId: z.string().min(1, 'Catégorie requise'),
})

export const updateBookSchema = createBookSchema.partial()

export const bookFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
  sellerId: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'SOLD', 'RESERVED', 'ARCHIVED']).optional(),
  sortBy: z.enum(['price', 'createdAt', 'viewCount', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(50).default(12),
})

// ============================================
// LIVRES AUDIO
// ============================================

export const audiobookFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  isPopular: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortBy: z.enum(['createdAt', 'playCount', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(50).default(12),
})

export const updateAudioProgressSchema = z.object({
  audiobookId: z.string(),
  chapterId: z.string(),
  position: z.number().int().min(0),
  completed: z.boolean().optional(),
  speed: z.number().min(0.5).max(3).optional(),
})

// ============================================
// WALLET & TRANSACTIONS
// ============================================

export const depositSchema = z.object({
  amount: z.number().positive('Montant doit être positif').min(100, 'Minimum 100 XOF'),
  provider: z.enum(['MTN_MOMO', 'MOOV_MONEY']),
  phoneNumber: z.string().min(10, 'Numéro de téléphone invalide'),
})

export const withdrawalSchema = z.object({
  amount: z.number().positive('Montant doit être positif').min(1000, 'Minimum 1000 XOF'),
  provider: z.enum(['MTN_MOMO', 'MOOV_MONEY']),
  phoneNumber: z.string().min(10, 'Numéro de téléphone invalide'),
})

export const purchaseSchema = z.object({
  bookIds: z.array(z.string()).min(1, 'Au moins un livre requis'),
  deliveryType: z.enum(['SHIPPING', 'LOCAL_PICKUP']),
  deliveryAddress: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryCountry: z.string().optional(),
  deliveryPhone: z.string().optional(),
  notes: z.string().optional(),
})

// ============================================
// ABONNEMENTS
// ============================================

export const subscriptionSchema = z.object({
  plan: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
})

// ============================================
// POSTS & RÉSEAU SOCIAL
// ============================================

export const createPostSchema = z.object({
  type: z.enum(['TEXT', 'IMAGE', 'REVIEW', 'RECOMMENDATION']),
  content: z.string().min(1, 'Contenu requis').max(5000),
  images: z.array(z.string().url()).max(10).optional(),
  bookTitle: z.string().optional(),
  bookAuthor: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
})

export const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1, 'Commentaire requis').max(2000),
  parentId: z.string().optional(),
})

// ============================================
// AVIS
// ============================================

export const createReviewSchema = z.object({
  type: z.enum(['BOOK', 'AUDIOBOOK', 'SELLER']),
  bookId: z.string().optional(),
  audiobookId: z.string().optional(),
  sellerId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().min(10, 'Avis minimum 10 caractères').max(2000),
})

// ============================================
// COMMANDES
// ============================================

export const updateOrderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
})

// ============================================
// SIGNALEMENTS
// ============================================

export const createReportSchema = z.object({
  targetId: z.string().optional(),
  postId: z.string().optional(),
  commentId: z.string().optional(),
  reason: z.enum(['SPAM', 'INAPPROPRIATE', 'HARASSMENT', 'FAKE', 'COPYRIGHT', 'OTHER']),
  description: z.string().max(1000).optional(),
})

// ============================================
// MESSAGES
// ============================================

export const sendMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1, 'Message requis').max(5000),
  images: z.array(z.string().url()).max(5).optional(),
})

// ============================================
// RECHERCHE
// ============================================

export const searchSchema = z.object({
  query: z.string().min(1, 'Recherche requise'),
  type: z.enum(['all', 'books', 'audiobooks', 'users', 'posts']).default('all'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(50).default(20),
})

// Types inférés
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type BookFilterInput = z.infer<typeof bookFilterSchema>
export type AudiobookFilterInput = z.infer<typeof audiobookFilterSchema>
export type DepositInput = z.infer<typeof depositSchema>
export type WithdrawalInput = z.infer<typeof withdrawalSchema>
export type PurchaseInput = z.infer<typeof purchaseSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type CreateReportInput = z.infer<typeof createReportSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type SearchInput = z.infer<typeof searchSchema>
