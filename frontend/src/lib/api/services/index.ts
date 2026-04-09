/**
 * Favorites & Reviews API Services
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

// Favorites
export interface Favorite {
  id: string;
  user: string;
  book?: string;
  audiobook?: string;
  created_at: string;
}

export const favoritesService = {
  // Get all favorites
  getFavorites: (params?: any) =>
    apiClient.get<Favorite[]>(API_ENDPOINTS.FAVORITES.MY_FAVORITES, { params }),

  // Add book to favorites
  addBook: (bookId: string) =>
    apiClient.post(API_ENDPOINTS.FAVORITES.ADD_BOOK, { book_id: bookId }),

  // Add audiobook to favorites
  addAudiobook: (audiobookId: string) =>
    apiClient.post(API_ENDPOINTS.FAVORITES.ADD_AUDIOBOOK, { audiobook_id: audiobookId }),

  // Remove from favorites
  remove: (bookId?: string, audiobookId?: string) =>
    apiClient.post(API_ENDPOINTS.FAVORITES.REMOVE, {
      book_id: bookId,
      audiobook_id: audiobookId,
    }),

  // Check if item is favorited
  isFavorited: (bookId?: string, audiobookId?: string) =>
    apiClient.get(API_ENDPOINTS.FAVORITES.LIST, {
      params: {
        book_id: bookId,
        audiobook_id: audiobookId,
      },
    }),
};

// Reviews
export interface Review {
  id: string;
  reviewer: string;
  reviewer_username: string;
  reviewer_avatar?: string;
  book?: string;
  audiobook?: string;
  rating: number;
  title: string;
  content: string;
  is_verified_purchase: boolean;
  is_reported: boolean;
  helpful_count: number;
  unhelpful_count: number;
  created_at: string;
  updated_at: string;
}

export const reviewsService = {
  // Get reviews for product
  getReviews: (bookId?: string, audiobookId?: string) =>
    apiClient.get<Review[]>(API_ENDPOINTS.REVIEWS.LIST, {
      params: {
        book_id: bookId,
        audiobook_id: audiobookId,
      },
    }),

  // Get user's reviews
  getMyReviews: () =>
    apiClient.get<Review[]>(API_ENDPOINTS.REVIEWS.MY_REVIEWS),

  // Create review for book
  createBookReview: (data: {
    book_id: string;
    rating: number;
    title: string;
    content: string;
  }) =>
    apiClient.post(API_ENDPOINTS.REVIEWS.CREATE_BOOK_REVIEW, data),

  // Create review for audiobook
  createAudiobookReview: (data: {
    audiobook_id: string;
    rating: number;
    title: string;
    content: string;
  }) =>
    apiClient.post(API_ENDPOINTS.REVIEWS.CREATE_AUDIOBOOK_REVIEW, data),

  // Mark review as helpful
  markHelpful: (reviewId: string) =>
    apiClient.post(
      `${API_ENDPOINTS.REVIEWS.LIST}${reviewId}/mark_helpful/`,
      {}
    ),

  // Mark review as unhelpful
  markUnhelpful: (reviewId: string) =>
    apiClient.post(
      `${API_ENDPOINTS.REVIEWS.LIST}${reviewId}/mark_unhelpful/`,
      {}
    ),
};
