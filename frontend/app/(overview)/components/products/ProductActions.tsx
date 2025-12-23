'use client'

import { Product } from '../../../dashboard/products/ProductsOverview'
import { AddToCartButton } from '../../../components/AddToCardButton'
import { useRouter } from 'next/navigation'

interface Props {
    product: Product
}

export default function ProductActions({ product }: Props) {
    const router = useRouter()

    return (
        <div className="flex items-center justify-between gap-3">
            <button
                onClick={() => router.push(`/products/${product.id}`)}
                className="text-sm font-medium text-blue-600 hover:underline"
            >
                Ver detalhes
            </button>

            <AddToCartButton product={product} />
        </div>
    )
}
