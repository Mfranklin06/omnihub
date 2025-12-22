'use client'

import { StoreHeader } from '../components/StoreHeader'
import { useCartStore } from '@/lib/store'
import { CheckCircle, Loader2, ShieldCheck, ShoppingBag, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import type {
    IPaymentFormData,
    IPaymentBrickCustomization
} from '@mercadopago/sdk-react/esm/bricks/payment/type'
import Link from 'next/link'

type AllOrArrayLocal = 'all' | string[]

// Payload que sua API Go espera
interface GoAPIPayload {
    transaction_amount: number
    token: string
    description: string
    installments: number
    payment_method_id: string
    issuer_id: string
    payer: {
        email: string
        identification: {
            type: string
            number: string
        }
    }
}

export default function CartPage() {
    const { cart, totalPrice, clearCart } = useCartStore()
    const [mounted, setMounted] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setMounted(true)
        const key = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
        if (key) initMercadoPago(key, { locale: 'pt-BR' })
    }, [])

    if (!mounted) return null

    // --- CONFIGURAÇÕES DO BRICK ---
    // Se você quiser usar a carteira MercadoPago (mercadoPago), é necessário gerar e passar `preferenceId`
    // dentro de initialization: { amount, preferenceId: 'PREFERENCE_ID' }
    const initialization = {
        amount: totalPrice(),
        payer: {
            email: 'cliente@teste.com',
        },
        // preferenceId: 'COLOQUE_SUA_PREFERENCE_ID_AQUI_SE_USAR_MERCADOPAGO', // <- opcional / necessário para 'mercadoPago'
    }

    // Tipagem correta: usamos AllOrArray para evitar conflito com inferência de 'string'
    const customization: IPaymentBrickCustomization = {
        paymentMethods: {
            ticket: 'all' as AllOrArrayLocal,
            bankTransfer: 'all' as AllOrArrayLocal,
            creditCard: 'all' as AllOrArrayLocal,
            debitCard: 'all' as AllOrArrayLocal,
            // Atente-se: habilitar 'mercadoPago' normalmente requer `preferenceId` na initialization.
            mercadoPago: 'all' as AllOrArrayLocal,
        },
        visual: {
            style: {
                theme: 'default' as const,
            },
            hidePaymentButton: isLoading,
        },
    }

    // --- ONSUBMIT COM TIPO ---
    const onSubmit = async (formData: IPaymentFormData) => {
        setIsLoading(true)
        setErrorMessage('')

        try {
            const token = formData.formData?.token || ''
            const issuerId = formData.formData?.issuer_id || ''
            const description = formData.formData?.payment_method_id || 'Compra Antigravity'

            const payload: GoAPIPayload = {
                transaction_amount: formData.formData?.transaction_amount,
                token,
                description,
                installments: formData.formData?.installments,
                payment_method_id: formData.formData?.payment_method_id || '',
                issuer_id: issuerId,
                payer: {
                    email: formData.formData?.payer.email || '',
                    identification: {
                        type: formData.formData?.payer.identification.type || '',
                        number: formData.formData?.payer.identification.number || '',
                    },
                },
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ecommerce/process_payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (response.ok && data.status === 'approved') {
                setPaymentStatus('success')
                clearCart()
            } else {
                setPaymentStatus('error')
                setErrorMessage(data.error || data.detail || 'Não foi possível processar o pagamento.')
            }
        } catch (error) {
            console.error(error)
            setPaymentStatus('error')
            setErrorMessage('Erro de conexão com o servidor.')
        } finally {
            setIsLoading(false)
        }
    }

    // --- UI: SUCESSO ---
    if (paymentStatus === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <StoreHeader />
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-md w-full border border-green-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600 w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 text-gray-900">Sucesso!</h1>
                    <p className="text-gray-600 mb-8 text-lg">Seu pagamento foi aprovado.</p>
                    <Link href="/" className="block w-full bg-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition">
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        )
    }

    // --- UI: CHECKOUT ---
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <StoreHeader />
            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="w-8 h-8 text-gray-800" />
                    <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Resumo do Pedido */}
                    <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                            <div className="p-6 bg-gray-50 border-b border-gray-100">
                                <h2 className="font-bold text-lg text-gray-900">Resumo do Pedido</h2>
                            </div>

                            <div className="p-6">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Seu carrinho está vazio.</p>
                                ) : (
                                    <div className="space-y-4 max-h-100 overflow-y-auto pr-2 scrollbar-thin">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                    <span className="text-xs text-gray-500">Qtd: {item.quantity}</span>
                                                </div>
                                                <span className="font-semibold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="my-6 border-t border-gray-100 border-dashed" />

                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 font-medium">Total a pagar</span>
                                    <span className="text-3xl font-bold text-gray-900">R$ {totalPrice().toFixed(2)}</span>
                                </div>

                                <div className="mt-6 bg-green-50 rounded-lg p-3 flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-green-800">
                                        <strong>Compra Garantida.</strong> Seus dados estão protegidos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Componente de Pagamento */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        {cart.length > 0 ? (
                            <div className="relative">
                                {isLoading && (
                                    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-gray-100">
                                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                        <p className="text-gray-600 font-medium animate-pulse">Processando...</p>
                                    </div>
                                )}

                                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-200">
                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 px-2">
                                        <Lock className="w-4 h-4" />
                                        <span>Ambiente seguro Mercado Pago</span>
                                    </div>

                                    <Payment
                                        initialization={initialization}
                                        customization={customization}
                                        onSubmit={onSubmit}
                                        onReady={() => console.log('Brick pronto')}
                                        onError={(error) => console.error('Erro no Brick', error)}
                                    />

                                    {paymentStatus === 'error' && (
                                        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-center gap-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                            {errorMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg mb-6">Carrinho vazio.</p>
                                <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition">
                                    Ir às compras
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
