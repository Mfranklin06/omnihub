'use client'

import { initMercadoPago } from '@mercadopago/sdk-react'
import { StoreHeader } from '../components/StoreHeader'
import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import { Trash2, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!)

export default function CartPage() {
    const { cart, removeFromCart, totalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    // Hydration fix
    useState(() => setMounted(true))
    if (!mounted) return null

    async function handleCheckout() {
        setLoading(true)
        try {
            const payload = {
                items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
                source: 'ecommerce' // Importante!
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ecommerce/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (!res.ok) throw new Error('Erro ao processar pedido' + data.error)

            if (data.preference_id) {
                const mplink = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.preference_id}`
                window.location.href = mplink
            }

            //alert('Compra realizada com sucesso!')
            //clearCart()
            //router.push('/')

        } catch (error) {
            alert('Erro no checkout. Verifique o backend.' + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StoreHeader />

            <main className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

                {cart.length === 0 ? (
                    <p className="text-gray-500">Seu carrinho está vazio.</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {cart.map((item) => (
                                <div key={item.id} className="p-6 flex gap-4 items-center">
                                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs mt-1 flex items-center gap-1 justify-end hover:underline">
                                            <Trash2 size={12} /> Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold">R$ {totalPrice().toFixed(2)}</p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="bg-black text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                            >
                                {loading ? 'Processando...' : 'Finalizar Compra'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}