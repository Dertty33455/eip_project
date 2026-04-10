/**
 * Reviews Hooks - React Query integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '@/lib/api/services';

// Query Keys
const REVIEWS_QUERY_KEYS = {
  all: ['reviews'] as const,
  list: () => [...REVIEWS_QUERY_KEYS.all, 'list'] as const,
  myReviews: () => [...REVIEWS_QUERY_KEYS.all, 'my-reviews'] as const,
  bookReviews: (bookId: string) => [...REVIEWS_QUERY_KEYS.list(), 'book', bookId] as const,
  audiobookReviews: (audiobookId: string) => [...REVIEWS_QUERY_KEYS.list(), 'audiobook', audiobookId] as const,
};

// Get reviews for a product
export const useGetReviews = (bookId?: string, audiobookId?: string) => {
  return useQuery({
    queryKey: bookId ? REVIEWS_QUERY_KEYS.bookReviews(bookId) : REVIEWS_QUERY_KEYS.audiobookReviews(audiobookId || ''),
    queryFn: async () => {
      const response = await reviewsService.getReviews(bookId, audiobookId);
      return response.data;
    },
    enabled: !!bookId || !!audiobookId,
  });
};

// Get user's reviews
export const useGetMyReviews = () => {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEYS.myReviews(),
    queryFn: async () => {
      const response = await reviewsService.getMyReviews();
      return response.data;
    },
  });
};

// Create book review
export const useCreateBookReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      book_id: string;
      rating: number;
      title: string;
      content: string;
    }) => {
      const response = await reviewsService.createBookReview(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.bookReviews(variables.book_id) });
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.myReviews() });
    },
  });
};

// Create audiobook review
export const useCreateAudiobookReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      audiobook_id: string;
      rating: number;
      title: string;
      content: string;
    }) => {
      const response = await reviewsService.createAudiobookReview(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.audiobookReviews(variables.audiobook_id) });
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.myReviews() });
    },
  });
};

// Mark review as helpful
export const useMarkHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await reviewsService.markHelpful(reviewId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.list() });
    },
  });
};

// Mark review as unhelpful
export const useMarkUnhelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await reviewsService.markUnhelpful(reviewId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.list() });
    },
  });
};
