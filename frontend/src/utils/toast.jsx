import toast from 'react-hot-toast';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from 'lucide-react';

const TOAST_STYLES = {
    base: 'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg max-w-sm w-full',
    success: 'border-green-200 bg-white text-[#0f172a]',
    error: 'border-red-200 bg-white text-[#0f172a]',
    warning: 'border-amber-200 bg-white text-[#0f172a]',
    info: 'border-blue-200 bg-white text-[#0f172a]',
};

const ICONS = {
    success: { Icon: CheckCircle2, className: 'text-[#22c55e]' },
    error: { Icon: XCircle, className: 'text-[#ef4444]' },
    warning: { Icon: AlertTriangle, className: 'text-[#f59e0b]' },
    info: { Icon: Info, className: 'text-[#2563eb]' },
};

function renderToast(type, message, t) {
    const { Icon, className } = ICONS[type];

    return (
        <div
            className={`${TOAST_STYLES.base} ${TOAST_STYLES[type]} ${
                t.visible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
        >
            <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${className}`}
                strokeWidth={1.75}
                aria-hidden="true"
            />
            <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
            <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="focus-ring rounded-md p-0.5 text-[#64748b] transition-colors hover:text-[#0f172a]"
                aria-label="Dismiss notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

function showToast(type, message) {
    return toast.custom((t) => renderToast(type, message, t), {
        duration: type === 'error' ? 5000 : 4000,
    });
}

export const showSuccess = (message) => showToast('success', message);
export const showError = (message) => showToast('error', message);
export const showWarning = (message) => showToast('warning', message);
export const showInfo = (message) => showToast('info', message);

export const toastConfig = {
    position: 'top-right',
    reverseOrder: false,
    gutter: 12,
};
