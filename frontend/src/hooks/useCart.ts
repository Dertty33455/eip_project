'use client'

import { useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'
import { useCartStore } from './useCartStore'
import { cartService } from '@/lib/api/services/cart'

// OLD FUNCTION - Keep for backward compatibility
export function useCart() {
    const { get, post, patch, delete: del } = useApi()
    const { user } = useAuth()
    const { cart, setCart, isLoading, setIsLoading } = useCartStore()

    const addToCart = async (bookId: string, quantity: number = 1) => {
        if (!user) {
            toast.error('Connectez-vous pour ajouter au panier')
            return
        }

        try {
            const { data, error } = await post('/api/cart', { book_id: bookId, quantity })
            if (!error && data) {
                setCart(data.cart)
                toast.success('Ajouté au panier')
                return true
            }
        } catch (error) {
            console.error('Error adding to cart:', error)
        }
        return false
    }

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            const { data, error } = await patch(`/api/cart-items/${itemId}`, { quantity })
            if (!error && data) {
                setCart(data.cart)
                return true
            }
        } catch (error) {
            console.error('Error updating quantity:', error)
        }
        return false
    }

    const removeItem = async (itemId: string) => {
        try {
            const { data, error } = await del(`/api/cart-items/${itemId}`)
            if (!error && data) {
                setCart(data.cart)
                toast.success('Retiré du panier')
                return true
            }
        } catch (error) {
            console.error('Error removing item:', error)
        }
        return false
    }

    const clearCart = async () => {
        setCart(null)
    }

    const subtotal = cart?.items.reduce((acc, item) => acc + (item.book.price * item.quantity), 0) || 0
    const tax = subtotal * 0.05
    const total = subtotal + tax

    return {
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount: cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0
    }
}

// NEW REACT QUERY HOOKS - For new implementations
// Query Keys
const CART_QUERY_KEYS = {
  all: ['cart'] as const,
  detail: () => [...CART_QUERY_KEYS.all, 'detail'] as const,
};

// Get user's cart
export const useGetCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEYS.detail(),
    queryFn: async () => {
      const response = await cartService.getCart();
      return response.data;
    },
  });
};

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { book_id?: string; audiobook_id?: string; quantity: number }) => {
      const response = await cartService.addItem(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() });
    },
  });
};

// Remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await cartService.removeItem(itemId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() });
    },
  });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await cartService.updateItem(itemId, quantity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() });
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await cartService.clearCart();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() });
    },
  });
};

// Checkout
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await cartService.checkout(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() });
    },
  });
};
