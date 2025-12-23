// app/components/editorial/EditorialBanner.tsx
import Image from 'next/image'

export default function EditorialBanner() {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Image */}
            <Image
                src="/editorial/editorial-01.png"
                alt="Editorial"
                fill
                priority
                sizes='(min-width: 1024px) 300px, (min-width: 768px) 200px, 100vw'
                loading='eager'
                className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-xl text-white">
                        <p className="uppercase tracking-[0.3em] text-xs mb-6">
                            Nova Coleção
                        </p>

                        <h2 className="font-serif text-4xl md:text-6xl leading-tight">
                            Elegância
                            <br />
                            que atravessa
                            <br />
                            gerações
                        </h2>

                        <p className="mt-6 text-sm text-gray-200 leading-relaxed">
                            Design atemporal, materiais premium e uma estética
                            construída para durar além das tendências.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
