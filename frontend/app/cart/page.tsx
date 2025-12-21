'use client'

import { StoreHeader } from '../components/StoreHeader'
import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import { Trash2, ArrowRight, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import Link from 'next/link'

export default function CartPage() {
    const { cart, removeFromCart, totalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Estado para guardar o ID da preferência do Mercado Pago
    const [preferenceId, setPreferenceId] = useState<string | null>(null)

    // 1. Inicializa o SDK do Mercado Pago
    useEffect(() => {
        setMounted(true)
        if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
            initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
                locale: 'pt-BR'
            })
        }
    }, [])

    if (!mounted) return null

    async function handleCheckout() {
        setLoading(true)
        try {
            // 2. Prepara os dados para o Go
            const payload = {
                items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
                source: 'ecommerce'
            }

            // 3. Chama o Backend em Go
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ecommerce/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao criar pedido')
            }

            // 4. EM VEZ DE REDIRECIONAR, salvamos o ID
            // Isso fará o componente "Wallet" aparecer na tela
            if (data.preference_id) {
                setPreferenceId(data.preference_id)
            }

        } catch (error) {
            console.error(error)
            alert('Erro ao iniciar pagamento.')
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
                    <div className="text-center py-20">
                        <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
                        <Link href="/" className="text-black font-bold underline">Voltar para a loja</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* Lista de Produtos */}
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
                                        {/* Só permite remover se ainda não gerou o pagamento */}
                                        {!preferenceId && (
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs mt-1 flex items-center gap-1 justify-end hover:underline">
                                                <Trash2 size={12} /> Remover
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Área de Totais e Ação */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm text-gray-500">Total a Pagar</p>
                                <p className="text-2xl font-bold">R$ {totalPrice().toFixed(2)}</p>
                            </div>

                            {/* LÓGICA DE TROCA DE BOTÃO */}
                            {preferenceId ? (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <p className="text-center text-sm text-gray-500 mb-2">Escolha como pagar:</p>

                                    {/* COMPONENTE DO MERCADO PAGO */}
                                    <div className="mp-wallet-container">
                                        <Wallet
                                            initialization={{ preferenceId: preferenceId }}
                                            customization={
                                                {
                                                    valueProp: 'smart_option'
                                                }
                                            }
                                        />
                                    </div>

                                    <button
                                        onClick={() => setPreferenceId(null)}
                                        className="w-full text-center text-xs text-gray-400 mt-4 hover:text-black underline"
                                    >
                                        Cancelar e voltar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" /> Processando...
                                        </>
                                    ) : (
                                        <>
                                            Finalizar Compra <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}