'use client'

import { Plus } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'
import { Product } from '../dashboard/products/ProductsOverview'

export function AddToCartButton({ product }: { product: Product }) {
    const addToCart = useCartStore((state) => state.addToCart)

    return (
        <button
            onClick={() => {
                addToCart(product)
                toast.success('Adicionado ao carrinho')
            }}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition shadow-lg active:scale-90"
        >
            <Plus size={20} />
        </button>
    )
}