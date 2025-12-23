// app/components/header/HeaderNav.tsx
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'

export default function HeaderNav() {
    return (
        <nav className="hidden md:flex gap-10 text-xs tracking-widest uppercase">
            <Link href="/store" className="hover:opacity-70 transition">
                Loja
            </Link>
            <Link href="/collections" className="hover:opacity-70 transition">
                Coleções
            </Link>
            <Link href="/about" className="hover:opacity-70 transition">
                Sobre
            </Link>
            <Link href="/cart" className="hover:opacity-70 transition">
                <ShoppingCartIcon className="w-6 h-6" />
            </Link>
        </nav>
    )
}
