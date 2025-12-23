// app/components/header/HeaderClient.tsx
'use client'

import { useEffect, useState } from 'react'

export default function HeaderClient({ children }: { children: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className={`transition-colors duration-300 ${scrolled ? 'bg-white text-black shadow-sm' : 'bg-transparent text-white'}`}>
            {children}
        </div>
    )
}
