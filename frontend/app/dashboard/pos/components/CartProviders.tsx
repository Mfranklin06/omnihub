"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { CartItem, Product } from "./PosLayout";

type CartContextValue = {
    items: CartItem[];
    addToCart: (product: Product, qty?: number) => void;
    removeFromCart: (productId: number) => void;
    increment: (productId: number) => void;
    decrement: (productId: number) => void;
    total: number;
    isOpen: boolean;
    toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addToCart = (product: Product, qty = 1) => {
        setItems(prev => {
            const found = prev.find(i => i.id === product.id);
            if (found) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
            }
            return [{ ...product, qty }, ...prev];
        });
        setIsOpen(true);
    };

    const removeFromCart = (productId: number) => setItems(prev => prev.filter(i => i.id !== productId));
    const increment = (productId: number) =>
        setItems(prev => prev.map(i => i.id === productId ? { ...i, qty: i.qty + 1 } : i));
    const decrement = (productId: number) =>
        setItems(prev => prev.map(i => i.id === productId ? { ...i, qty: Math.max(1, i.qty - 1) } : i));

    const total = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

    const toggleCart = () => setIsOpen(v => !v);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, increment, decrement, total, isOpen, toggleCart }}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
