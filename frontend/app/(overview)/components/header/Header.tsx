import HeaderClient from './HeaderClient'
import HeaderNav from './HeaderNav'

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <HeaderClient>
                <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <span className="text-xl tracking-[0.4em] font-semibold">
                        OMNIHUB
                    </span>

                    <HeaderNav />
                </div>
            </HeaderClient>
        </header>
    )
}
