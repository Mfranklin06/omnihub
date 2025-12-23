import { Product } from '../../../dashboard/products/ProductsOverview'
import ProductCard from './ProductCard'

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        cache: 'no-store',
    })

    if (!res.ok) return []
    return res.json()
}

export default async function ProductsGrid() {
    const products = await getProducts()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
