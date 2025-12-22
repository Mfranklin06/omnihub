import { cookies } from 'next/headers'
import { ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react'

type DashboardStats = {
    total_revenue: number
    total_orders: number
    low_stock: number
    recent_orders: Array<{
        id: number
        total_amount: number
        status: string
        order_source: string
        created_at: string
        items: Array<{
            product: { name: string }
            quantity: number
        }>
    }>
}

async function getStats(): Promise<DashboardStats | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    })

    if (!res.ok) return null

    return res.json()
}

export default async function DashboardContent() {
    const stats = await getStats()

    if (!stats) {
        return (
            <div className="p-8 bg-white rounded-xl border border-red-200">
                <h1 className="text-xl font-bold text-red-600 mb-2">
                    Erro ao carregar dashboard
                </h1>
                <p className="text-gray-600">
                    Verifique se você está logado e tente novamente.
                </p>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h1>

            {/* --- CARDS DE MÉTRICAS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Receita */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Receita Total</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total_revenue)}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="text-green-600" size={24} />
                    </div>
                </div>

                {/* Pedidos */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Vendas Realizadas</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total_orders}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <ShoppingBag className="text-blue-600" size={24} />
                    </div>
                </div>

                {/* Estoque Baixo */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Estoque Crítico</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.low_stock}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                        <AlertTriangle className="text-orange-600" size={24} />
                    </div>
                </div>
            </div>

            {/* --- TABELA DE VENDAS RECENTES --- */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Vendas Recentes</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">ID Pedido</th>
                            <th className="px-6 py-4">Canal</th>
                            <th className="px-6 py-4">Resumo</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stats.recent_orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.order_source === 'pos' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.order_source === 'pos' ? 'PDV Loja' : 'Online'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {order.items.length > 0 ? (
                                        <span>
                                            {order.items[0].product.name}
                                            {order.items.length > 1 && ` + ${order.items.length - 1} itens`}
                                        </span>
                                    ) : 'Sem itens'}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}
                                </td>
                            </tr>
                        ))}
                        {stats.recent_orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Nenhuma venda registrada hoje.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
