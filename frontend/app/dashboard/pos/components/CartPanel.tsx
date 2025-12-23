// app/pos/components/CartPanel.tsx
'use client'

import { useMemo } from 'react'
import CartItemRow from './CartItemRow'
import CheckoutFooter from './CheckoutFooter'
import type { CartItem } from './PosLayout'
import { ShoppingCart } from 'lucide-react'

export default function CartPanel({
    cart,
    updateQty,
    token,
    clearCart
}: {
    cart: CartItem[]
    updateQty: (id: number, delta: number) => void
    token: string
    clearCart: () => void
}) {
    const totalAmount = useMemo(() => cart.reduce((a, b) => a + b.price * b.qty, 0), [cart])
    const totalItems = useMemo(() => cart.reduce((a, b) => a + b.qty, 0), [cart])

    return (
        <aside className="w-96 bg-white flex flex-col rounded-xl border border-gray-200 shadow-lg">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <ShoppingCart size={20} />
                    Carrinho Atual
                </h2>
                <span className="text-sm text-gray-500">{totalItems} itens</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                        <ShoppingCart size={48} className="mb-2" />
                        <p>Caixa Livre</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <CartItemRow key={item.id} item={item} updateQty={updateQty} />
                    ))
                )}
            </div>

            <CheckoutFooter
                totalAmount={totalAmount}
                cart={cart}
                token={token}
                clearCart={clearCart}
            />
        </aside>
    )
}
