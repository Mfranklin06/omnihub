import { Suspense } from 'react'
import ProductsOverview from './ProductsOverview'

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsOverview />
        </Suspense>
    )
}

function ProductsLoading() {
    return (
        <div className="h-[60vh] bg-gray-100 rounded-xl animate-pulse" />
    )
}
