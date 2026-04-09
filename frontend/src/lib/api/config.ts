/**
 * API Configuration
 * Central configuration for all API requests to the Django backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile/',
    ACTIVITIES: '/auth/activities/',
    VERIFICATION_TOKENS: '/auth/verification-tokens/',
  },

  // Wallet
  WALLET: {
    DETAIL: '/wallet/',
    BALANCE: '/wallet/balance/',
    STATS: '/wallet/stats/',
    TRANSACTIONS: '/wallet/transactions/',
    PAYMENT_METHODS: '/wallet/payment-methods/',
    DEPOSIT: '/wallet/deposit/',
    PAYMENT: '/wallet/pay/',
    WITHDRAWALS: '/wallet/withdrawals/',
    SUBSCRIPTION_PRICING: '/wallet/subscription-pricing/',
  },

  // Orders
  ORDERS: {
    LIST: '/orders/orders/',
    CREATE: '/orders/orders/',
    DETAIL: '/orders/orders/{id}/',
    MY_ORDERS: '/orders/orders/my_orders/',
    SELLING: '/orders/orders/selling/',
    MARK_PAID: '/orders/orders/{id}/mark_paid/',
    MARK_SHIPPED: '/orders/orders/{id}/mark_shipped/',
    MARK_DELIVERED: '/orders/orders/{id}/mark_delivered/',
    CANCEL: '/orders/orders/{id}/cancel/',
    ITEMS: '/orders/items/',
    INVOICES: '/orders/invoices/',
  },

  // Cart
  CART: {
    MY_CART: '/cart/carts/my_cart/',
    ADD_ITEM: '/cart/carts/add_item/',
    REMOVE_ITEM: '/cart/carts/remove_item/',
    UPDATE_ITEM: '/cart/carts/update_item/',
    CLEAR: '/cart/carts/clear/',
  },

  // Messaging
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations/',
    START_CONVERSATION: '/messages/conversations/start_conversation/',
    SEND_MESSAGE: '/messages/conversations/{id}/send_message/',
    GET_MESSAGES: '/messages/conversations/{id}/messages/',
  },

  // Favorites
  FAVORITES: {
    LIST: '/favorites/favorites/',
    MY_FAVORITES: '/favorites/favorites/my_favorites/',
    ADD_BOOK: '/favorites/favorites/add_book/',
    ADD_AUDIOBOOK: '/favorites/favorites/add_audiobook/',
    REMOVE: '/favorites/favorites/remove/',
  },

  // Reviews
  REVIEWS: {
    LIST: '/reviews/reviews/',
    MY_REVIEWS: '/reviews/reviews/my_reviews/',
    CREATE_BOOK_REVIEW: '/reviews/reviews/create_book_review/',
    CREATE_AUDIOBOOK_REVIEW: '/reviews/reviews/create_audiobook_review/',
    MARK_HELPFUL: '/reviews/reviews/{id}/mark_helpful/',
  },

  // Books
  BOOKS: {
    LIST: '/books/',
    DETAIL: '/books/{id}/',
  },

  // Audiobooks
  AUDIOBOOKS: {
    LIST: '/audiobooks/',
    DETAIL: '/audiobooks/{id}/',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories/',
    DETAIL: '/categories/{id}/',
  },
};

export default API_BASE_URL;
