import { Product } from './PosLayout'
import ProductCard from './ProductCard'

export default function ProductGrid({
    products,
    onAdd
}: {
    products: Product[]
    onAdd: (p: Product) => void
}) {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} onAdd={onAdd} />
                ))}
            </div>
        </div>
    )
}
