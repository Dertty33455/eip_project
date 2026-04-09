/**
 * Cart API Service
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

export interface CartItem {
  id: string;
  cart: string;
  book?: string;
  audiobook?: string;
  product_title: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user: string;
  total_items: number;
  subtotal: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export const cartService = {
  // Get user's cart
  getCart: () =>
    apiClient.get<Cart>(API_ENDPOINTS.CART.MY_CART),

  // Add item to cart
  addItem: (data: {
    book_id?: string;
    audiobook_id?: string;
    quantity: number;
  }) =>
    apiClient.post(API_ENDPOINTS.CART.ADD_ITEM, data),

  // Remove item from cart
  removeItem: (itemId: string) =>
    apiClient.post(API_ENDPOINTS.CART.REMOVE_ITEM, { item_id: itemId }),

  // Update item quantity
  updateItem: (itemId: string, quantity: number) =>
    apiClient.post(API_ENDPOINTS.CART.UPDATE_ITEM, {
      item_id: itemId,
      quantity,
    }),

  // Clear cart
  clearCart: () =>
    apiClient.post(API_ENDPOINTS.CART.CLEAR, {}),

  // Checkout (create order from cart)
  checkout: (data: any) =>
    apiClient.post('/orders/orders/', data),
};
