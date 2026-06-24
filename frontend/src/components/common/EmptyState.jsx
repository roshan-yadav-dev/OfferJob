import { Link } from 'react-router-dom';

function EmptyState({
    title,
    message = 'No data available',
    icon: Icon,
    actionLabel,
    actionTo,
    onAction,
    className = '',
}) {
    return (
        <div
            className={`animate-fade-in-up rounded-2xl border border-[#e2e8f0] bg-white px-6 py-12 text-center shadow-sm ${className}`}
        >
            {Icon && (
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
                    <Icon
                        className="h-7 w-7 text-[#64748b]"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                </div>
            )}

            <h3 className="text-lg font-semibold text-[#0f172a]">
                {title || message}
            </h3>

            {title && message && (
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748b]">
                    {message}
                </p>
            )}

            {actionLabel && actionTo && (
                <Link
                    to={actionTo}
                    className="focus-ring mt-6 inline-flex items-center justify-center rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-[#1d4ed8]"
                >
                    {actionLabel}
                </Link>
            )}

            {actionLabel && onAction && !actionTo && (
                <button
                    type="button"
                    onClick={onAction}
                    className="focus-ring mt-6 inline-flex items-center justify-center rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-[#1d4ed8]"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
