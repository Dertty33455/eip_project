import { create } from 'zustand'

export interface CartItem {
    id: string
    book_id: string
    quantity: number
    book: {
        id: string
        title: string
        author: string
        price: number
        coverImage: string
        stock: number
    }
}

export interface Cart {
    id: string
    user_id: string
    items: CartItem[]
}

interface CartState {
    cart: Cart | null
    isLoading: boolean
    setCart: (cart: Cart | null) => void
    setIsLoading: (isLoading: boolean) => void
}

export const useCartStore = create<CartState>()((set) => ({
    cart: null,
    isLoading: false,
    setCart: (cart) => set({ cart }),
    setIsLoading: (isLoading) => set({ isLoading }),
}))
