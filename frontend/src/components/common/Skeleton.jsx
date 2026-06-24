function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`animate-skeleton rounded-lg bg-slate-200/80 ${className}`}
            aria-hidden="true"
            {...props}
        />
    );
}

export function SkeletonLine({ className = '' }) {
    return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonCircle({ className = 'h-10 w-10' }) {
    return <Skeleton className={`rounded-full ${className}`} />;
}

export function CardSkeleton({ lines = 3 }) {
    return (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex gap-4">
                <SkeletonCircle />
                <div className="min-w-0 flex-1 space-y-3">
                    <SkeletonLine className="h-5 w-2/3" />
                    <SkeletonLine className="h-4 w-1/3" />
                    {Array.from({ length: lines }).map((_, i) => (
                        <SkeletonLine
                            key={i}
                            className={i === lines - 1 ? 'w-4/5' : 'w-full'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PageHeaderSkeleton() {
    return (
        <div className="space-y-3">
            <SkeletonLine className="h-8 w-48 sm:w-64" />
            <SkeletonLine className="h-4 w-full max-w-md" />
        </div>
    );
}

export function StatsGridSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm"
                >
                    <div className="mb-4 flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <SkeletonLine className="h-4 w-24" />
                    </div>
                    <SkeletonLine className="h-8 w-16" />
                    <SkeletonLine className="mt-2 h-4 w-32" />
                </div>
            ))}
        </div>
    );
}

export function DashboardPageSkeleton() {
    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeaderSkeleton />
            <StatsGridSkeleton />
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <SkeletonLine className="mb-6 h-6 w-40" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        </div>
    );
}

export function JobListSkeleton({ count = 4 }) {
    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeaderSkeleton />
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <SkeletonLine className="mb-4 h-10 w-full" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: count }).map((_, i) => (
                    <CardSkeleton key={i} lines={4} />
                ))}
            </div>
        </div>
    );
}

export function ApplicationListSkeleton({ count = 3 }) {
    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeaderSkeleton />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: count }).map((_, i) => (
                    <CardSkeleton key={i} lines={3} />
                ))}
            </div>
        </div>
    );
}

export function ProfileFormSkeleton() {
    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeaderSkeleton />
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <SkeletonLine className="h-4 w-24" />
                            <SkeletonLine className="h-10 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function AppShellSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
            <div className="w-full max-w-sm space-y-4 rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
                <SkeletonCircle className="mx-auto h-12 w-12" />
                <SkeletonLine className="mx-auto h-5 w-32" />
                <SkeletonLine className="h-10 w-full rounded-xl" />
                <SkeletonLine className="h-10 w-full rounded-xl" />
            </div>
        </div>
    );
}

export default Skeleton;
