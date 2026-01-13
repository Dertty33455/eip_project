import type { Book, Conversation, Message, Order, Report, User } from '../types'
import { nowISO } from '../lib/format'

const baseISO = nowISO()

export const categories = [
  'Romans',
  'Scolaires',
  'Universitaires',
  'BD',
  'Jeunesse',
  'Développement personnel',
  'Informatique',
  'Histoire',
]

export const demoUsers: User[] = [
  {
    id: 'u_admin',
    role: 'admin',
    isBlocked: false,
    displayName: 'Admin',
    email: 'admin@demo.com',
    phone: '+22500000000',
    location: 'Abidjan',
    joinedAtISO: baseISO,
  },
  {
    id: 'u_seller_1',
    role: 'user',
    isBlocked: false,
    displayName: 'Aïcha K.',
    phone: '+22501020304',
    location: 'Cocody',
    joinedAtISO: baseISO,
  },
  {
    id: 'u_buyer_1',
    role: 'user',
    isBlocked: false,
    displayName: 'Koffi B.',
    phone: '+22505060708',
    location: 'Yopougon',
    joinedAtISO: baseISO,
  },
]

export const demoBooks: Book[] = [
  {
    id: 'b_1',
    title: "L'Étranger",
    author: 'Albert Camus',
    category: 'Romans',
    description:
      "Édition poche. Quelques traces d’usage sur la couverture, pages propres.",
    priceXof: 2000,
    condition: 'Occasion',
    status: 'Disponible',
    location: 'Cocody',
    photos: ['https://picsum.photos/seed/bookmarket-b_1/600/900'],
    seller: {
      id: 'u_seller_1',
      displayName: 'Aïcha K.',
      rating: 4.6,
      reviewsCount: 18,
      location: 'Cocody',
    },
    publishedAtISO: baseISO,
    views: 124,
    favoritesCount: 9,
  },
  {
    id: 'b_2',
    title: 'Mathématiques – Terminale',
    author: 'Collectif',
    category: 'Scolaires',
    description:
      "Livre scolaire en bon état. Idéal pour révisions. Quelques annotations au crayon.",
    priceXof: 3500,
    condition: 'Occasion',
    status: 'Disponible',
    location: 'Yopougon',
    photos: ['https://picsum.photos/seed/bookmarket-b_2/600/900'],
    seller: {
      id: 'u_seller_1',
      displayName: 'Aïcha K.',
      rating: 4.6,
      reviewsCount: 18,
      location: 'Cocody',
    },
    publishedAtISO: baseISO,
    views: 58,
    favoritesCount: 3,
  },
  {
    id: 'b_3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Informatique',
    description: 'Version anglaise. Très bon état. Remise en main propre possible.',
    priceXof: 12000,
    condition: 'Neuf',
    status: 'Disponible',
    location: 'Plateau',
    photos: ['https://picsum.photos/seed/bookmarket-b_3/600/900'],
    seller: {
      id: 'u_seller_1',
      displayName: 'Aïcha K.',
      rating: 4.6,
      reviewsCount: 18,
      location: 'Cocody',
    },
    publishedAtISO: baseISO,
    views: 311,
    favoritesCount: 22,
  },
]

export const demoConversations: Conversation[] = [
  {
    id: 'c_1',
    bookId: 'b_1',
    buyerUserId: 'u_buyer_1',
    sellerUserId: 'u_seller_1',
    lastMessageAtISO: baseISO,
    unreadCountByUserId: { u_buyer_1: 0, u_seller_1: 2 },
  },
]

export const demoMessages: Message[] = [
  {
    id: 'm_1',
    conversationId: 'c_1',
    senderUserId: 'u_buyer_1',
    text: 'Bonjour, le livre est-il toujours disponible ?',
    createdAtISO: baseISO,
  },
  {
    id: 'm_2',
    conversationId: 'c_1',
    senderUserId: 'u_seller_1',
    text: 'Bonjour ! Oui, il est disponible. Vous êtes dans quel quartier ?',
    createdAtISO: baseISO,
  },
]

export const demoOrders: Order[] = [
  {
    id: 'o_1',
    bookId: 'b_2',
    buyerUserId: 'u_buyer_1',
    sellerUserId: 'u_seller_1',
    amountXof: 3500,
    paymentMethod: 'Mobile Money',
    status: 'Terminé',
    createdAtISO: baseISO,
  },
]

export const demoReports: Report[] = [
  {
    id: 'r_1',
    target: 'Livre',
    targetId: 'b_3',
    reason: 'Suspicion de prix anormalement élevé (à vérifier).',
    createdAtISO: baseISO,
    status: 'Ouvert',
  },
]
