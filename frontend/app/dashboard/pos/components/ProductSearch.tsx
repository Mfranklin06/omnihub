import { Search } from 'lucide-react'

export default function ProductSearch({
    value,
    onChange
}: {
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="p-4 border-b bg-gray-50">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Buscar por nome ou SKU"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-black"
                    autoFocus
                />
            </div>
        </div>
    )
}
