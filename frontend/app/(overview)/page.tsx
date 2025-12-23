// app/page.tsx
import { Suspense } from 'react'
import { StoreHeader } from '../components/StoreHeader'
import ProductsGrid from './ProductsGrid'

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      {/* Hero */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          O Futuro do Varejo
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Descubra nossa coleção exclusiva. Qualidade premium, entrega rápida.
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Destaques</h2>

        <Suspense fallback={<div>Carregando produtos...</div>}>
          <ProductsGrid />
        </Suspense>
      </main>
    </div>
  )
}
