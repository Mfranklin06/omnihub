// app/pos/components/CartItemRow.tsx
'use client'

import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import type { CartItem } from './PosLayout'

export default function CartItemRow({ item, updateQty }: { item: CartItem, updateQty: (id: number, delta: number) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">—</div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
          <p className="text-xs text-gray-500">Unit: R$ {item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-red-500" aria-label="Diminuir">
          <Minus size={14} />
        </button>
        <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
        <button onClick={() => updateQty(item.id, 1)} disabled={item.qty >= item.stock_qty} className="p-1 hover:bg-gray-100 rounded text-green-600 disabled:opacity-30" aria-label="Aumentar">
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}
