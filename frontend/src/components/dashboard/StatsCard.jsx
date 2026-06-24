const COLOR_MAP = {
    blue: {
        iconBg: 'bg-blue-50',
        iconColor: 'text-[#2563eb]',
    },
    green: {
        iconBg: 'bg-green-50',
        iconColor: 'text-[#22c55e]',
    },
    red: {
        iconBg: 'bg-red-50',
        iconColor: 'text-[#ef4444]',
    },
    amber: {
        iconBg: 'bg-amber-50',
        iconColor: 'text-[#f59e0b]',
    },
    purple: {
        iconBg: 'bg-purple-50',
        iconColor: 'text-[#7c3aed]',
    },
};

const PROGRESS_COLOR_MAP = {
    red: 'bg-[#ef4444]',
    amber: 'bg-[#f59e0b]',
    green: 'bg-[#22c55e]',
};

export function getAtsProgressColor(score) {
    if (score < 40) return 'red';
    if (score <= 70) return 'amber';
    return 'green';
}

function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = 'blue',
    progressValue,
}) {
    const colors = COLOR_MAP[color] || COLOR_MAP.blue;
    const progressColor =
        progressValue != null ? getAtsProgressColor(progressValue) : null;

    return (
        <div
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
            "
        >
            <div className="mb-4 flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.iconBg}`}
                >
                    <Icon
                        className={`h-5 w-5 ${colors.iconColor}`}
                        strokeWidth={1.75}
                    />
                </div>
                <h3 className="text-sm font-medium text-[#64748b]">{title}</h3>
            </div>

            <p className="text-3xl font-bold tracking-tight text-[#0f172a]">
                {value ?? 0}
            </p>

            {subtitle && (
                <p className="mt-1.5 text-sm text-[#64748b]">{subtitle}</p>
            )}

            {progressValue != null && (
                <div className="mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className={`h-full rounded-full transition-all duration-200 ease-in-out ${PROGRESS_COLOR_MAP[progressColor]}`}
                            style={{
                                width: `${Math.min(100, Math.max(0, progressValue))}%`,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default StatsCard;
