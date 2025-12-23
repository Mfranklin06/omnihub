'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Product } from './PosLayout'

export default function ProductCard({
    product,
    onAdd
}: {
    product: Product
    onAdd: (p: Product) => void
}) {
    return (
        <button
            onClick={() => onAdd(product)}
            disabled={product.stock_qty <= 0}
            className="group text-left bg-white border rounded-lg p-3 hover:shadow-md transition disabled:opacity-40"
        >
            <div className="relative h-32 bg-gray-100 rounded mb-2 overflow-hidden">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                        <ShoppingCart />
                    </div>
                )}
            </div>

            <p className="text-sm font-medium line-clamp-2">{product.name}</p>
            <p className="font-bold mt-1">R$ {product.price.toFixed(2)}</p>
        </button>
    )
}
