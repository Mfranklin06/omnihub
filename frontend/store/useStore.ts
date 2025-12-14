import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, Product } from '@/types';

interface Store {
    // User
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;

    // Cart
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;

    // Wishlist
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;

    // UI
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            // User
            user: null,
            token: null,

            setUser: (user) => {
                set({ user });
                if (typeof window !== 'undefined') {
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                    } else {
                        localStorage.removeItem('user');
                    }
                }
            },

            setToken: (token) => {
                set({ token });
                if (typeof window !== 'undefined') {
                    if (token) {
                        localStorage.setItem('token', token);
                    } else {
                        localStorage.removeItem('token');
                    }
                }
            },

            logout: () => {
                set({ user: null, token: null, cart: [] });
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            },

            // Cart
            cart: [],

            addToCart: (product) => {
                const { cart } = get();
                const existing = cart.find((item) => item.id === product.id);

                if (existing) {
                    if (existing.quantity < product.stock) {
                        set({
                            cart: cart.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        });
                    }
                } else {
                    set({
                        cart: [...cart, { ...product, quantity: 1 }],
                    });
                }
            },

            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                } else {
                    const { cart } = get();
                    const item = cart.find((i) => i.id === productId);
                    if (item && quantity <= item.stock) {
                        set({
                            cart: cart.map((item) =>
                                item.id === productId ? { ...item, quantity } : item
                            ),
                        });
                    }
                }
            },

            clearCart: () => set({ cart: [] }),

            getCartTotal: () => {
                return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },

            getCartCount: () => {
                return get().cart.reduce((sum, item) => sum + item.quantity, 0);
            },

            // Wishlist
            wishlist: [],

            toggleWishlist: (productId) => {
                const { wishlist } = get();
                if (wishlist.includes(productId)) {
                    set({ wishlist: wishlist.filter((id) => id !== productId) });
                } else {
                    set({ wishlist: [...wishlist, productId] });
                }
            },

            isInWishlist: (productId) => {
                return get().wishlist.includes(productId);
            },

            // UI
            sidebarOpen: false,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
        }),
        {
            name: 'ecommerce-storage',
            partialize: (state) => ({
                cart: state.cart,
                wishlist: state.wishlist,
            }),
        }
    )
);