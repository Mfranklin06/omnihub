// app/store/HeroSection.tsx
import Image from 'next/image'
import Link from 'next/link'

async function getHeroProduct() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        cache: 'no-store',
    })

    if (!res.ok) return null

    const products = await res.json()

    return products[0] ?? null
}

export default async function HeroSection() {
    const product = await getHeroProduct()

    if (!product) return null

    return (
        <section className="relative min-h-screen pt-52 w-full overflow-hidden bg-black">
            <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-6">
                    <div className="max-w-xl text-white">
                        <span className="block text-xs tracking-[0.3em] uppercase text-white/80 mb-4">
                            Nova Coleção
                        </span>
                        <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6">
                            {product.name}
                        </h1>

                        <p className="text-lg text-white/90 mb-10">
                            R$ {product.price.toFixed(2)}
                        </p>
                        <Link
                            href={`/product/${product.id}`}
                            className="inline-block border border-white px-10 py-3 text-sm tracking-wide uppercase hover:bg-white hover:text-black transition-colors"
                        >
                            Descobrir
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
