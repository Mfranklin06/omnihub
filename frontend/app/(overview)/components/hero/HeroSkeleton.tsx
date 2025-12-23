export default function HeroSkeleton() {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-gray-200">
            <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-200" />

            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 flex h-full items-center">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="max-w-2xl space-y-6">
                        <div className="h-4 w-32 rounded bg-white/40" />
                        <div className="h-14 w-full max-w-xl rounded bg-white/50" />
                        <div className="h-14 w-4/5 rounded bg-white/40" />
                        <div className="h-5 w-96 rounded bg-white/30" />
                        <div className="mt-8 h-12 w-48 rounded-full bg-white/60" />
                    </div>
                </div>
            </div>
        </section>
    )
}
