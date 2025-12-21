import { Product } from '@/app/dashboard/products/page'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
    id: number
    name: string
    price: number
    image_url: string
    quantity: number
}

type CartStore = {
    cart: CartItem[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product: Product) => {
                const currentCart = get().cart
                const existingItem = currentCart.find((item) => item.id === product.id)

                if (existingItem) {
                    set({
                        cart: currentCart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    })
                } else {
                    set({ cart: [...currentCart, { ...product, quantity: 1 }] })
                }
            },

            removeFromCart: (id: number) => {
                set({ cart: get().cart.filter((item) => item.id !== id) })
            },

            clearCart: () => set({ cart: [] }),

            totalItems: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'shopping-cart', // Nome da chave no localStorage
        }
    )
)