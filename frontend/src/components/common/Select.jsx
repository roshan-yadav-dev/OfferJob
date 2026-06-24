function Select({
    label,
    name,
    register,
    error,
    helperText,
    id,
    required = false,
    disabled = false,
    children,
    className = '',
    ...rest
}) {
    const selectId = id || name;

    return (
        <div className={`flex w-full flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium text-[#0f172a]"
                >
                    {label}
                    {required && (
                        <span className="ml-0.5 text-[#ef4444]" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            <select
                id={selectId}
                name={name}
                disabled={disabled}
                required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={
                    error
                        ? `${selectId}-error`
                        : helperText
                          ? `${selectId}-helper`
                          : undefined
                }
                {...(register ? register(name) : {})}
                {...rest}
                className={[
                    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0f172a] transition-all duration-200 ease-in-out',
                    'focus-ring focus:border-[#2563eb]',
                    error
                        ? 'border-[#ef4444] focus:ring-red-200'
                        : 'border-[#e2e8f0] hover:border-slate-300',
                    disabled ? 'cursor-not-allowed bg-slate-50 opacity-70' : '',
                ].join(' ')}
            >
                {children}
            </select>

            {helperText && !error && (
                <p
                    id={`${selectId}-helper`}
                    className="text-xs text-[#64748b]"
                >
                    {helperText}
                </p>
            )}

            {error && (
                <p
                    id={`${selectId}-error`}
                    className="text-xs font-medium text-[#ef4444]"
                    role="alert"
                >
                    {error.message}
                </p>
            )}
        </div>
    );
}

export default Select;
