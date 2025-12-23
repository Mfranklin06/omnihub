import { Suspense } from 'react'
import ProductsOverview from './ProductsOverview'
import LoadingProducts from './loading'

export default function ProductsPage() {
    return (
        <Suspense fallback={<LoadingProducts />}>
            <ProductsOverview />
        </Suspense>
    )
}


