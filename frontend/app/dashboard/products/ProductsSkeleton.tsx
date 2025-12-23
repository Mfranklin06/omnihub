export default function ProductsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-6 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-56 bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-32 bg-gray-300 rounded-lg" />
            </div>

            {[1, 2, 3, 4].map(i => (
                <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-gray-200 rounded-xl" />
                        <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                            <div className="h-3 w-24 bg-gray-100 rounded" />
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-6 w-24 bg-gray-100 rounded-full" />
                        <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}
