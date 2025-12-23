import { Suspense } from 'react'
import HeroSection from './components/hero/HeroSection'
import Header from './components/header/Header'
import HeroSkeleton from './components/hero/HeroSkeleton'
import Footer from './components/Footer'
import ProductsGrid from './components/products/ProductsGrid'
import EditorialBanner from './components/EditorialBanner'

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-black">Destaques</h2>

        <Suspense fallback={<div>Carregando produtos...</div>}>
          <ProductsGrid />
        </Suspense>
      </main>
      <EditorialBanner />
      <Footer />
    </div>
  )
}
