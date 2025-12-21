'use client'

import { Plus } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner' // Opcional: Feedback visual
import { Product } from '../dashboard/products/page'

export function AddToCartButton({ product }: { product: Product }) {
    const addToCart = useCartStore((state) => state.addToCart)

    return (
        <button
            onClick={() => {
                addToCart(product)
                // Se quiser instalar: npm install sonner
                toast.success('Adicionado ao carrinho')
                //alert('Adicionado!') // Fallback simples
            }}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition shadow-lg active:scale-90"
        >
            <Plus size={20} />
        </button>
    )
}