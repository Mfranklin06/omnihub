export default function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-56 bg-gray-200 rounded" />
                    <div className="h-4 w-72 bg-gray-100 rounded" />
                </div>

                <div className="flex gap-3">
                    <div className="h-10 w-28 bg-gray-200 rounded-md" />
                    <div className="h-10 w-32 bg-gray-300 rounded-md" />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4"
                    >
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-8 w-32 bg-gray-300 rounded" />

                        <div className="h-10 w-full bg-gray-100 rounded" />

                        <div className="flex justify-end">
                            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5].map((row) => (
                            <div
                                key={row}
                                className="grid grid-cols-5 gap-4 px-5 py-4"
                            >
                                <div className="h-4 bg-gray-200 rounded w-16" />
                                <div className="h-4 bg-gray-100 rounded w-20" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-100 rounded w-24" />
                                <div className="h-4 bg-gray-300 rounded w-24 justify-self-end" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
