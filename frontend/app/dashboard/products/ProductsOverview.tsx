import Link from 'next/link'
import Image from 'next/image'
import { Plus, Package } from 'lucide-react'

export interface Product {
    id: number
    name: string
    sku: string
    price: number
    stock_qty: number
    image_url: string
}

async function getProducts(): Promise<Product[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        { cache: 'no-store' }
    )

    if (!res.ok) return []
    return res.json()
}

export default async function ProductsOverview() {
    const products = await getProducts()

    return (
        <section className="space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Produtos
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gerencie catálogo, preços e estoque
                    </p>
                </div>

                <Link
                    href="/dashboard/products/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    <Plus size={16} />
                    Novo produto
                </Link>
            </header>

            {/* Lista */}
            <div className="space-y-3">
                {products.map(product => (
                    <article
                        key={product.id}
                        className="group flex items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-4 transition hover:shadow-sm"
                    >
                        {/* Left */}
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <Package size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate font-medium text-gray-900">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    SKU: {product.sku}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                    R$ {product.price.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">Preço</p>
                            </div>

                            <div>
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${product.stock_qty > 0
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {product.stock_qty > 0
                                        ? `${product.stock_qty} em estoque`
                                        : 'Sem estoque'}
                                </span>
                            </div>

                            <Link
                                href={`/dashboard/products/${product.id}`}
                                className="text-sm font-medium text-gray-400 hover:text-black"
                            >
                                Editar
                            </Link>
                        </div>
                    </article>
                ))}

                {products.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                        <p className="text-sm text-gray-500">
                            Nenhum produto cadastrado ainda.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
