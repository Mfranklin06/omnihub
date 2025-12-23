// app/components/footer/Footer.tsx
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-24">
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-600">

                {/* Marca */}
                <div>
                    <h3 className="text-lg font-semibold tracking-widest mb-4 text-black">
                        OMNIHUB
                    </h3>
                    <p className="text-gray-500 leading-relaxed">
                        Tecnologia, design e experiência redefinindo o varejo moderno.
                    </p>
                </div>

                {/* Navegação */}
                <div>
                    <h4 className="uppercase tracking-widest text-xs text-black mb-4">
                        Navegação
                    </h4>
                    <ul className="space-y-2">
                        <li><Link href="/store">Loja</Link></li>
                        <li><Link href="/collections">Coleções</Link></li>
                        <li><Link href="/about">Sobre</Link></li>
                    </ul>
                </div>

                {/* Suporte */}
                <div>
                    <h4 className="uppercase tracking-widest text-xs text-black mb-4">
                        Suporte
                    </h4>
                    <ul className="space-y-2">
                        <li>Contato</li>
                        <li>Entrega</li>
                        <li>Trocas</li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="uppercase tracking-widest text-xs text-black mb-4">
                        Legal
                    </h4>
                    <p className="text-gray-500">
                        © 2026 Omnihub
                        <br />
                        Todos os direitos reservados.
                    </p>
                </div>

            </div>
        </footer>
    )
}
