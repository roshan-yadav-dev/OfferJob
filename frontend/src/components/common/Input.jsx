function Input({ label, type = 'text', placeholder, register, name, error }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="font-medium text-gray-700">{label}</label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                {...register(name)}
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
