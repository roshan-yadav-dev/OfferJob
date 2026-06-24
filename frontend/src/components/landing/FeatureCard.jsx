function FeatureCard({ icon: Icon, title, description }) {
    return (
        <article
            className="
                rounded-2xl
                border
                border-[#e2e8f0]
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-200
                ease-in-out
                hover:-translate-y-[3px]
                hover:shadow-md
                sm:p-7
            "
        >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Icon className="h-5 w-5 text-[#2563eb]" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-[#0f172a]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                {description}
            </p>
        </article>
    );
}

export default FeatureCard;
