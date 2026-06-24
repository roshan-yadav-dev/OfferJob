function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    disabled = false,
    loading = false,
    'aria-label': ariaLabel,
}) {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ease-in-out focus-ring disabled:cursor-not-allowed disabled:opacity-60';

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-5 py-3 text-base',
    };

    const variants = {
        primary:
            'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.98]',
        secondary:
            'bg-slate-100 text-[#0f172a] hover:bg-slate-200 active:scale-[0.98]',
        outline:
            'border border-[#e2e8f0] bg-white text-[#2563eb] hover:border-[#2563eb]/30 hover:bg-blue-50 active:scale-[0.98]',
        danger:
            'bg-[#ef4444] text-white hover:bg-red-600 active:scale-[0.98]',
        ghost:
            'text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a] active:scale-[0.98]',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={ariaLabel}
            aria-busy={loading}
            className={`${baseStyles} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
        >
            {loading && (
                <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                />
            )}
            {loading ? 'Please wait...' : children}
        </button>
    );
}

export default Button;
