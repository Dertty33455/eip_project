/**
 * Favorites Hooks - React Query integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/lib/api/services';

// Query Keys
const FAVORITES_QUERY_KEYS = {
  all: ['favorites'] as const,
  list: () => [...FAVORITES_QUERY_KEYS.all, 'list'] as const,
};

// Get all favorites
export const useGetFavorites = () => {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEYS.list(),
    queryFn: async () => {
      const response = await favoritesService.getFavorites();
      return response.data;
    },
  });
};

// Add book to favorites
export const useAddBookToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string) => {
      const response = await favoritesService.addBook(bookId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.list() });
    },
  });
};

// Add audiobook to favorites
export const useAddAudiobookToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (audiobookId: string) => {
      const response = await favoritesService.addAudiobook(audiobookId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.list() });
    },
  });
};

// Remove from favorites
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, audiobookId }: { bookId?: string; audiobookId?: string }) => {
      const response = await favoritesService.remove(bookId, audiobookId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.list() });
    },
  });
};

// Check if item is favorited
export const useIsFavorited = (bookId?: string, audiobookId?: string) => {
  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEYS.list(), bookId, audiobookId],
    queryFn: async () => {
      const response = await favoritesService.isFavorited(bookId, audiobookId);
      return response.data;
    },
    enabled: !!bookId || !!audiobookId,
  });
};
