export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Vendas Hoje</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">R$ 0,00</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Pedidos</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Produtos Ativos</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
                </div>
            </div>
        </div>
    )
}