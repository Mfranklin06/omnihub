'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useEffectEvent, useState } from 'react'

export function StoreHeader() {
    const totalItems = useCartStore((state) => state.totalItems())
    const [mounted, setMounted] = useState(false)

    // Evita erro de hidratação (server vs client)
    useEffectEvent(() => setMounted(true))

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tighter">
                    Antigravity.
                </Link>

                <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
                    <ShoppingBag size={24} />
                    {mounted && totalItems > 0 && (
                        <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                            {totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    )
}