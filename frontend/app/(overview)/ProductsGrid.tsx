// app/store/ProductsGrid.tsx (ou app/ProductsGrid.tsx)
import Image from 'next/image'
import { AddToCartButton } from '../components/AddToCardButton'
import { Product } from '../dashboard/products/ProductsOverview'

async function getProducts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        cache: 'no-store',
    })

    if (!res.ok) return []
    return res.json()
}

export default async function ProductsGrid() {
    const products = await getProducts()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product: Product) => (
                <div key={product.id} className="group">
                    <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden mb-4">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem foto
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                R$ {product.price.toFixed(2)}
                            </p>
                        </div>

                        <AddToCartButton product={product} />
                    </div>
                </div>
            ))}
        </div>
    )
}
