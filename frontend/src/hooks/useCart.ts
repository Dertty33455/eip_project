'use client'

import { useCallback, useEffect } from 'react'
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'
import { useCartStore } from './useCartStore'

export function useCart() {
    const { get, post, patch, delete: del } = useApi()
    const { user } = useAuth()
    const { cart, setCart, isLoading, setIsLoading } = useCartStore()

    const fetchCart = useCallback(async () => {
        if (!user || isLoading) return
        setIsLoading(true)
        try {
            const { data, error } = await get('/api/cart')
            if (!error && data) {
                setCart(data)
            }
        } catch (error) {
            console.error('Error fetching cart:', error)
        } finally {
            setIsLoading(false)
        }
    }, [get, user, isLoading, setCart, setIsLoading])

    useEffect(() => {
        if (!user) {
            setCart(null)
            return
        }
        if (!cart && !isLoading) {
            fetchCart()
        }
    }, [fetchCart, user, cart, isLoading, setCart])

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
    const tax = subtotal * 0.05 // 5% tax example
    const total = subtotal + tax

    return {
        cart,
        isLoading,
        refreshCart: fetchCart,
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
