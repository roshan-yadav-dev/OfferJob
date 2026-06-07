function Input({
    label,
    type = 'text',
    placeholder,
    register,
    name,
    error,
    step,
    min,
    max,
    ...rest
}) {
    const handleWheel = (e) => {
        // Disable mouse wheel increment/decrement for number inputs
        if (type === 'number') {
            e.target.blur();
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="font-medium text-gray-700">{label}</label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                onWheel={handleWheel}
                step={step}
                min={min}
                max={max}
                {...register(name)}
                {...rest}
                className="
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-2
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "
            />

            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
    );
}

export default Input;
