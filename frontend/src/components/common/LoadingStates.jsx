import EmptyState from './EmptyState';
import {
    DashboardPageSkeleton,
    JobListSkeleton,
    ApplicationListSkeleton,
    ProfileFormSkeleton,
    AppShellSkeleton,
} from './Skeleton';

export {
    DashboardPageSkeleton,
    JobListSkeleton,
    ApplicationListSkeleton,
    ProfileFormSkeleton,
    AppShellSkeleton,
} from './Skeleton';

export { default as Skeleton } from './Skeleton';

/** @deprecated Use skeleton variants instead */
export const LoadingSpinner = ({ message }) => (
    <div
        className="flex min-h-[40vh] items-center justify-center"
        role="status"
        aria-live="polite"
    >
        <p className="sr-only">{message || 'Loading'}</p>
        <JobListSkeleton count={2} />
    </div>
);

export { EmptyState };

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
    <div className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="mb-2 text-lg font-semibold text-[#0f172a]">
            Something went wrong
        </p>
        <p className="mb-4 text-sm text-[#64748b]">{message}</p>
        {onRetry && (
            <button
                type="button"
                onClick={onRetry}
                className="focus-ring rounded-xl bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1d4ed8]"
            >
                Try again
            </button>
        )}
    </div>
);
