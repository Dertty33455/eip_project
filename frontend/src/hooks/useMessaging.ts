/**
 * Messaging Hooks - React Query integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagingService } from '@/lib/api/services/messaging';

// Query Keys
const MESSAGING_QUERY_KEYS = {
  all: ['messaging'] as const,
  conversations: () => [...MESSAGING_QUERY_KEYS.all, 'conversations'] as const,
  conversation: (id: string) => [...MESSAGING_QUERY_KEYS.all, 'conversation', id] as const,
  messages: (id: string) => [...MESSAGING_QUERY_KEYS.all, 'messages', id] as const,
};

// Get conversations
export const useGetConversations = () => {
  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.conversations(),
    queryFn: async () => {
      const response = await messagingService.getConversations();
      return response.data;
    },
  });
};

// Get single conversation
export const useGetConversation = (id: string | null) => {
  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.conversation(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Conversation ID is required');
      const response = await messagingService.getConversation(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get messages
export const useGetMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.messages(conversationId || ''),
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');
      const response = await messagingService.getMessages(conversationId);
      return response.data;
    },
    enabled: !!conversationId,
    refetchInterval: 1000, // Refetch every second for near real-time updates
  });
};

// Start conversation
export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await messagingService.startConversation({ user_ids: userIds });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.conversations() });
    },
  });
};

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, data }: { conversationId: string; data: any }) => {
      const response = await messagingService.sendMessage(conversationId, data);
      return response.data;
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.conversation(conversationId) });
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.conversations() });
    },
  });
};

// Mark as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await messagingService.markAsRead(conversationId);
      return response.data;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.conversation(conversationId) });
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      const response = await messagingService.deleteMessage(conversationId, messageId);
      return response.data;
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.messages(conversationId) });
    },
  });
};
