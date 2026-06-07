function StatsCard({ title, value, icon = '📊' }) {
    return (
        <div
            className="
                bg-white
                rounded-xl
                shadow-md
                p-6
                border-l-4
                border-blue-500
                hover:shadow-lg
                transition-shadow
                duration-200
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        {title}
                    </h3>

                    <p
                        className="
                            text-4xl
                            font-bold
                            mt-3
                            text-gray-900
                        "
                    >
                        {value ?? 0}
                    </p>
                </div>

                <div className="text-3xl opacity-20">{icon}</div>
            </div>
        </div>
    );
}

export default StatsCard;
