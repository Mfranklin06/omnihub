'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react' // we can add next Trash2 to the import if needed
import { useRouter } from 'next/navigation'

// Tipos
type Product = {
    id: number
    name: string
    price: number
    stock_qty: number
    image_url: string
    sku: string
}

type CartItem = Product & {
    qty: number
}

export default function POSInterface({ products, token }: { products: Product[], token: string }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const router = useRouter()

    // Filtra produtos na memória (rápido)
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Adicionar ao Carrinho
    function addToCart(product: Product) {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                )
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    // Remover/Diminuir item
    function updateQty(id: number, delta: number) {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, qty: Math.max(0, item.qty + delta) }
            }
            return item
        }).filter(item => item.qty > 0)) // Remove se chegar a 0
    }

    // Cálculos
    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0)

    // Finalizar Venda
    async function handleCheckout() {
        if (cart.length === 0) return
        setIsCheckingOut(true)

        try {
            const payload = {
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.qty
                })),
                source: 'pos'
            }

            console.log("Enviando payload:", payload) // Debug

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pos/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            // Tenta ler o JSON. Se falhar (ex: erro 404 html), cai no catch
            let data;
            try {
                data = await res.json();
            } catch (jsonError) {
                throw new Error(`Erro do Servidor (${res.status}): Resposta não é JSON.` + jsonError);
            }

            if (!res.ok) {
                throw new Error(data.error || `Erro desconhecido (${res.status})` + data.error);
            }

            alert('Venda realizada com sucesso!')
            setCart([])
            router.refresh()

        } catch (error: unknown) {
            console.error(error); // Mostra no console
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado';
            alert(`Falha: ${errorMessage}`);
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">

            {/* --- COLUNA ESQUERDA: CATÁLOGO --- */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Barra de Busca */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar produto por nome ou SKU..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-black transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Grid de Produtos */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                disabled={product.stock_qty <= 0}
                                className="group flex flex-col text-left bg-white border border-gray-100 rounded-lg p-3 hover:border-black hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="relative w-full h-32 bg-gray-100 rounded-md mb-3 overflow-hidden">
                                    {product.image_url ? (
                                        <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300"><ShoppingCart /></div>
                                    )}
                                    {/* Badge de Estoque */}
                                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full ${product.stock_qty > 0 ? 'bg-white/90 text-black' : 'bg-red-500 text-white'}`}>
                                        {product.stock_qty} un
                                    </span>
                                </div>
                                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-10">{product.name}</h3>
                                <p className="font-bold text-gray-900 mt-1">R$ {product.price.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- COLUNA DIREITA: CARRINHO --- */}
            <div className="w-96 bg-white flex flex-col rounded-xl border border-gray-200 shadow-lg">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <ShoppingCart size={20} />
                        Carrinho Atual
                    </h2>
                    <span className="text-sm text-gray-500">{totalItems} itens adicionados</span>
                </div>

                {/* Lista de Itens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <ShoppingCart size={48} className="mb-2" />
                            <p>Caixa Livre</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-gray-500">Unit: R$ {item.price.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-red-500"><Minus size={14} /></button>
                                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} disabled={item.qty >= item.stock_qty} className="p-1 hover:bg-gray-100 rounded text-green-600 disabled:opacity-30"><Plus size={14} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Rodapé e Checkout */}
                <div className="p-6 bg-gray-900 text-white mt-auto rounded-b-xl">
                    <div className="flex justify-between items-center mb-6">
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
            </div>

        </div>
    )
}