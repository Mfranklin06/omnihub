// app/pos/components/POSLayout.tsx
'use client'

import { useMemo, useState } from 'react'
import ProductSearch from './ProductSearch'
import ProductGrid from './ProductGrid'
import CartPanel from './CartPanel'

export type Product = {
    id: number
    name: string
    price: number
    stock_qty: number
    image_url?: string
    sku?: string
}

export type CartItem = Product & { qty: number }

export default function POSLayout({ products, token }: { products: Product[], token: string }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return products
        return products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.sku || '').toLowerCase().includes(q)
        )
    }, [products, search])

    function addToCart(product: Product) {
        setCart(prev => {
            const found = prev.find(i => i.id === product.id)
            if (found) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    function updateQty(id: number, delta: number) {
        setCart(prev =>
            prev
                .map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
                .filter(i => i.qty > 0)
        )
    }

    function clearCart() {
        setCart([])
    }

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Catalog */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                <ProductSearch value={search} onChange={setSearch} />
                <ProductGrid products={filtered} onAdd={addToCart} />
            </div>

            {/* Cart */}
            <CartPanel
                cart={cart}
                updateQty={updateQty}
                token={token}
                clearCart={clearCart}
            />
        </div>
    )
}
