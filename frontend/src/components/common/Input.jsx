function Input({
    label,
    type = 'text',
    placeholder,
    register,
    name,
    error,
    helperText,
    id,
    required = false,
    disabled = false,
    step,
    min,
    max,
    className = '',
    ...rest
}) {
    const inputId = id || name;

    const handleWheel = (e) => {
        if (type === 'number') {
            e.target.blur();
        }
    };

    return (
        <div className={`flex w-full flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
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

            <input
                id={inputId}
                type={type}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                onWheel={handleWheel}
                step={step}
                min={min}
                max={max}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={
                    error
                        ? `${inputId}-error`
                        : helperText
                          ? `${inputId}-helper`
                          : undefined
                }
                {...(register ? register(name) : {})}
                {...rest}
                className={[
                    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0f172a] transition-all duration-200 ease-in-out placeholder:text-[#94a3b8]',
                    'focus-ring focus:border-[#2563eb]',
                    error
                        ? 'border-[#ef4444] focus:ring-red-200'
                        : 'border-[#e2e8f0] hover:border-slate-300',
                    disabled ? 'cursor-not-allowed bg-slate-50 opacity-70' : '',
                ].join(' ')}
            />

            {helperText && !error && (
                <p
                    id={`${inputId}-helper`}
                    className="text-xs text-[#64748b]"
                >
                    {helperText}
                </p>
            )}

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="text-xs font-medium text-[#ef4444]"
                    role="alert"
                >
                    {error.message}
                </p>
            )}
        </div>
    );
}

export default Input;
