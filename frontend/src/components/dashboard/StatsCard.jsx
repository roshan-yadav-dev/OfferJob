function StatsCard({ title, value }) {
    return (
        <div
            className="
                bg-white
                rounded-xl
                shadow-md
                p-6
            "
        >
            <h3 className="text-gray-500 text-lg">{title}</h3>

            <p
                className="
                    text-3xl
                    font-bold
                    mt-3
                    text-blue-600
                "
            >
                {value ?? 0}
            </p>
        </div>
    );
}

export default StatsCard;
