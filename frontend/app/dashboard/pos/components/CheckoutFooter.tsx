// app/pos/components/CheckoutFooter.tsx
'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import type { CartItem } from './PosLayout'
import { useRouter } from 'next/navigation'

export default function CheckoutFooter({
    totalAmount,
    cart,
    token,
    clearCart
}: {
    totalAmount: number
    cart: CartItem[]
    token: string
    clearCart: () => void
}) {
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const router = useRouter()

    async function handleCheckout() {
        if (cart.length === 0) return
        setIsCheckingOut(true)

        try {
            const payload = {
                items: cart.map(item => ({ product_id: item.id, quantity: item.qty })),
                source: 'pos',
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pos/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            let data
            try {
                data = await res.json()
            } catch (e) {
                throw new Error(`Resposta inválida do servidor (${res.status})` + e)
            }

            if (!res.ok) {
                throw new Error(data.error || `Erro desconhecido (${res.status})`)
            }

            // sucesso
            alert('Venda realizada com sucesso!')
            clearCart()
            router.refresh()
        } catch (err: unknown) {
            console.error(err)
            alert(err instanceof Error ? err.message : 'Erro ao processar venda')
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <div className="p-6 bg-gray-900 text-white mt-auto rounded-b-xl">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Total a Pagar</span>
                <span className="text-3xl font-bold">R$ {totalAmount.toFixed(2)}</span>
            </div>

            <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className="w-full bg-white text-black py-4 rounded-lg font-bold text-lg hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isCheckingOut ? 'Processando...' : (
                    <>
                        <CheckCircle size={20} />
                        Finalizar Venda
                    </>
                )}
            </button>
        </div>
    )
}
