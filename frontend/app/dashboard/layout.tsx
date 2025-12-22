import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, LogOut, Package } from 'lucide-react'
import { logout } from './actions'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Omnihub</h2>
                    <span className="text-xs text-gray-500 font-medium">Retail System</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-black transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        Visão Geral
                    </Link>

                    <Link
                        href="/dashboard/products"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-black transition-colors"
                    >
                        <Package size={18} />
                        Produtos
                    </Link>

                    <Link
                        href="/dashboard/pos"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-black transition-colors"
                    >
                        <ShoppingBag size={18} />
                        PDV (Caixa)
                    </Link>
                </nav>

                {/* --- RODAPÉ DA SIDEBAR (LOGOUT) --- */}
                <div className="p-4 border-t border-gray-100">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} />
                            Sair
                        </button>
                    </form>
                </div>
            </aside>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}