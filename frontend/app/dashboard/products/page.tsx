import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'


export interface Product {
    id: number
    name: string
    sku: string
    price: number
    stock_qty: number
    image_url: string
}

// Fetch direto no componente (padrão Next 14/15/16)
async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        cache: 'no-store', // Sempre fresco
    })

    if (!res.ok) return []
    return res.json()
}

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
                <Link
                    href="/dashboard/products/new"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={16} />
                    Novo Produto
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Produto</th>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Preço</th>
                            <th className="px-6 py-4">Estoque</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded bg-gray-100 overflow-hidden">
                                            {product.image_url && (
                                                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                                <td className="px-6 py-4 font-medium">R$ {product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock_qty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock_qty} un
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-400">
                                    Editar
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Nenhum produto cadastrado ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}