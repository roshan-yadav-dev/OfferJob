function Button({
    children,
    type = 'button',
    variant = 'primary',
    onClick,
    className = '',
    disabled = false,
    loading = false,
}) {
    const baseStyles = `
            px-4
            py-2
            rounded-lg
            font-medium
            transition
            duration-200
            flex
            items-center
            justify-center
            gap-2
        `;

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',

        secondary: 'bg-gray-200 text-black hover:bg-gray-300',

        danger: 'bg-red-600 text-white hover:bg-red-700',

        outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            {loading && (
                <div
                    className="
                        h-5
                        w-5
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                        animate-spin
                    "
                />
            )}

            {loading ? 'Please wait...' : children}
        </button>
    );
}

export default Button;
