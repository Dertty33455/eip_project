/**
 * Messaging API Service
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

export interface Message {
  id: string;
  conversation: string;
  sender: string;
  sender_username: string;
  sender_avatar?: string;
  content: string;
  is_read: boolean;
  attachment_url?: string;
  attachment_type?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Conversation {
  id: string;
  participants: any[];
  messages: Message[];
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

export const messagingService = {
  // Get all conversations
  getConversations: (params?: any) =>
    apiClient.get<Conversation[]>(API_ENDPOINTS.MESSAGES.CONVERSATIONS, { params }),

  // Get single conversation
  getConversation: (id: string) =>
    apiClient.get<Conversation>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}${id}/`),

  // Start new conversation
  startConversation: (data: { user_ids: string[] }) =>
    apiClient.post(
      `${API_ENDPOINTS.MESSAGES.CONVERSATIONS}start_conversation/`,
      data
    ),

  // Get messages in conversation
  getMessages: (conversationId: string) =>
    apiClient.get<Message[]>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}${conversationId}/messages/`),

  // Send message
  sendMessage: (conversationId: string, data: {
    content: string;
    attachment_url?: string;
    attachment_type?: string;
  }) =>
    apiClient.post(
      `${API_ENDPOINTS.MESSAGES.CONVERSATIONS}${conversationId}/send_message/`,
      data
    ),

  // Mark messages as read
  markAsRead: (conversationId: string) =>
    apiClient.post(
      `${API_ENDPOINTS.MESSAGES.CONVERSATIONS}${conversationId}/mark_read/`,
      {}
    ),

  // Delete message
  deleteMessage: (conversationId: string, messageId: string) =>
    apiClient.delete(
      `${API_ENDPOINTS.MESSAGES.CONVERSATIONS}${conversationId}/messages/${messageId}/`
    ),
};
