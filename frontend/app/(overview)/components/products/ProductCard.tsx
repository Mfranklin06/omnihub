import Image from 'next/image'
import ProductActions from './ProductActions'
import { Product } from '@/app/dashboard/products/ProductsOverview'

interface Props {
    product: Product
}

export default function ProductCard({ product }: Props) {
    return (
        <article className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
            {/* Image */}
            <div className="relative aspect-4/3 bg-gray-100">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes='(min-width: 1024px) 300px, (min-width: 768px) 200px, 100vw'
                        loading='eager'
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        Sem imagem
                    </div>
                )}

                {/* Status */}
                <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold">
                    {product.stock_qty > 0 ? 'Em estoque' : 'Esgotado'}
                </span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        R$ {product.price.toFixed(2)}
                    </p>
                </div>

                {/* Client actions */}
                <ProductActions product={product} />
            </div>
        </article>
    )
}
