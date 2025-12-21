import Image from 'next/image'
// Vamos criar abaixo
import { Product } from './dashboard/products/page'
import { StoreHeader } from './components/StoreHeader'
import { AddToCartButton } from './components/AddToCardButton'

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export default async function StorePage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">O Futuro do Varejo</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Descubra nossa coleção exclusiva. Qualidade premium, entrega rápida.
        </p>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Destaques</h2>

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
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>
                )}
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">R$ {product.price.toFixed(2)}</p>
                </div>
                {/* Botão Client-Side isolado */}
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}