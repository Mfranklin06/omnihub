import { Suspense } from 'react'
import POSOverview from './POSOverview'

export default function POSPage() {
    return (
        <div className="h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ponto de Venda</h1>
                <p className="text-gray-500 text-sm">
                    Selecione os produtos para iniciar uma nova venda.
                </p>
            </div>

            <Suspense fallback={<div className="h-[70vh] animate-pulse bg-gray-100 rounded-xl" />}>
                <POSOverview />
            </Suspense>
        </div>
    )
}
