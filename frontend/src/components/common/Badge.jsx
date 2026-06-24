import {
    Clock,
    CheckCircle,
    XCircle,
    Send,
    Award,
    Lock,
} from 'lucide-react';

const STATUS_CONFIG = {
    applied: {
        label: 'Applied',
        className: 'bg-blue-50 text-[#2563eb] ring-blue-100',
        icon: Send,
    },
    pending: {
        label: 'Pending',
        className: 'bg-amber-50 text-[#f59e0b] ring-amber-100',
        icon: Clock,
    },
    shortlisted: {
        label: 'Shortlisted',
        className: 'bg-green-50 text-[#22c55e] ring-green-100',
        icon: CheckCircle,
    },
    rejected: {
        label: 'Rejected',
        className: 'bg-red-50 text-[#ef4444] ring-red-100',
        icon: XCircle,
    },
    accepted: {
        label: 'Offer',
        className: 'bg-purple-50 text-[#7c3aed] ring-purple-100',
        icon: Award,
    },
    offer: {
        label: 'Offer',
        className: 'bg-purple-50 text-[#7c3aed] ring-purple-100',
        icon: Award,
    },
    active: {
        label: 'Active',
        className: 'bg-green-50 text-[#22c55e] ring-green-100',
        icon: CheckCircle,
    },
    closed: {
        label: 'Closed',
        className: 'bg-slate-100 text-[#64748b] ring-slate-200',
        icon: Lock,
    },
    closed: {
        label: 'Closed',
        className: 'bg-slate-100 text-[#64748b] ring-slate-200',
        icon: Lock,
    },
    deleted: {
        label: 'Deleted',
        className: 'bg-red-50 text-[#ef4444] ring-red-100',
        icon: XCircle,
    },
    inactive: {
        label: 'No Applications',
        className: 'bg-slate-100 text-[#64748b] ring-slate-200',
        icon: Clock,
    },
};

function Badge({ status, label, className = '' }) {
    const key = status?.toLowerCase() || 'pending';
    const config = STATUS_CONFIG[key] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    const displayLabel = label || config.label;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${config.className} ${className}`}
        >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            {displayLabel}
        </span>
    );
}

export default Badge;
