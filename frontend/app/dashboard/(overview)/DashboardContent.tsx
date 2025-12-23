// app/dashboard/DashboardContent.tsx
import Link from 'next/link'
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

/** pega stats protegidas no server */
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

/** pequeno helper para formatar BRL */
function fmtBRL(value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

/** gera um path SVG simples (sparkline) a partir de um array de numbers */
function sparklinePath(values: number[], w = 120, h = 32) {
    if (!values.length) return ''
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const step = w / (values.length - 1 || 1)

    const points = values.map((v, i) => {
        const x = Math.round(i * step)
        const y = Math.round(h - ((v - min) / range) * h)
        return `${x},${y}`
    })
    return points.join(' ')
}

export default async function DashboardContent() {
    const stats = await getStats()

    if (!stats) {
        return (
            <div className="p-8 bg-white rounded-xl border border-red-200">
                <h1 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar dashboard</h1>
                <p className="text-gray-600">Verifique se você está logado e tente novamente.</p>
            </div>
        )
    }

    // preparações para sparkline: use os últimos 8 valores de recent_orders.total_amount
    const amounts = stats.recent_orders.slice(-8).map(o => Number(o.total_amount) || 0)
    const path = sparklinePath(amounts)

    return (
        <div className="space-y-8">
            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Visão Geral</h1>
                    <p className="text-sm text-gray-500 mt-1">Resumo rápido das métricas da loja</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/analytics"
                        className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                        Ver Analytics
                    </Link>
                    <Link
                        href="/dashboard/orders/new"
                        className="bg-[#3B82F6] text-white px-4 py-2 rounded-md font-medium hover:brightness-95"
                    >
                        Novo Pedido
                    </Link>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-400">Receita (Mês)</p>
                            <div className="mt-2 flex items-end gap-4">
                                <span className="text-2xl font-bold text-gray-900">{fmtBRL(stats.total_revenue)}</span>
                                <span className="text-xs text-gray-400">em 30 dias</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <TrendingUp className="text-green-600" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* sparkline */}
                    <div className="mt-4">
                        <svg width="100%" height="36" viewBox="0 0 120 32" preserveAspectRatio="none" className="w-full">
                            <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={path} />
                        </svg>
                        <p className="mt-2 text-xs text-gray-400">Tendência das últimas vendas</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-400">Vendas Realizadas</p>
                            <h3 className="mt-2 text-2xl font-bold text-gray-900">{stats.total_orders}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <ShoppingBag className="text-blue-600" size={20} />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-500">Total de pedidos processados</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-400">Estoque Crítico</p>
                            <h3 className="mt-2 text-2xl font-bold text-gray-900">{stats.low_stock}</h3>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <AlertTriangle className="text-orange-600" size={20} />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-500">Produtos com estoque abaixo do limite</p>
                </div>
            </div>

            {/* Recent orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Vendas Recentes</h2>
                    <Link href="/dashboard/orders" className="text-sm text-gray-500 hover:underline">
                        Ver todos
                    </Link>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-5 py-3 text-left">Pedido</th>
                                <th className="px-5 py-3 text-left">Canal</th>
                                <th className="px-5 py-3 text-left">Resumo</th>
                                <th className="px-5 py-3 text-left">Data</th>
                                <th className="px-5 py-3 text-right">Valor</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {stats.recent_orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 font-mono text-xs text-gray-500">#{order.id}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${order.order_source === 'pos' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.order_source === 'pos' ? 'PDV Loja' : 'Online'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-700">
                                        {order.items.length > 0 ? (
                                            <span>
                                                {order.items[0].product.name}
                                                {order.items.length > 1 && ` + ${order.items.length - 1} itens`}
                                            </span>
                                        ) : 'Sem itens'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        {new Date(order.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="px-5 py-4 text-right font-medium text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}
                                    </td>
                                </tr>
                            ))}

                            {stats.recent_orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">Nenhuma venda registrada recentemente.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
