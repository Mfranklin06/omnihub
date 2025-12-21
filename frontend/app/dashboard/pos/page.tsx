import { cookies } from 'next/headers'
import POSInterface from './pos-interface'

async function getProducts() {
    // Busca lista de produtos (sem cache para sempre ter estoque atualizado ao entrar)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
}

export default async function POSPage() {
    const products = await getProducts()

    // Precisamos do token para passar pro Client Component fazer o checkout
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || ''

    return (
        <div className="h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ponto de Venda</h1>
                <p className="text-gray-500 text-sm">Selecione os produtos para iniciar uma nova venda.</p>
            </div>

            <POSInterface products={products} token={token} />
        </div>
    )
}