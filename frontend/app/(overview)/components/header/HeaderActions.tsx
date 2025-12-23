'use client'

import { Menu, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import Link from 'next/link'

export default function HeaderActions() {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
                href="/cart"
                aria-label="Carrinho"
                className="p-2 hover:bg-gray-100 text-black rounded-full transition"
            >
                <ShoppingBag size={18} />
            </Link>

            {/* Mobile Menu */}
            <button
                aria-label="Menu"
                className="md:hidden p-2 hover:bg-gray-100 text-black rounded-full transition"
                onClick={() => setOpen(true)}
            >
                <Menu size={20} />
            </button>

            <MobileMenu open={open} onClose={() => setOpen(false)} />
        </div>
    )
}
