'use client'

import Link from 'next/link'
import { X } from 'lucide-react'

const links = [
    { label: 'Masculino', href: '/men' },
    { label: 'Feminino', href: '/women' },
    { label: 'Novidades', href: '/new' },
    { label: 'Coleções', href: '/collections' },
]

export default function MobileMenu({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 bg-white">
            <div className="flex items-center justify-between px-6 h-20 border-b">
                <span className="font-serif uppercase tracking-widest">OmniHub</span>
                <button onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <nav className="flex flex-col gap-6 px-6 py-10">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="text-lg tracking-wide text-gray-800"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
