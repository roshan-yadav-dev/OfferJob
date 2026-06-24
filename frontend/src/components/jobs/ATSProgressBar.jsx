export function getAtsBarColor(score) {
    if (score <= 40) return 'red';
    if (score <= 70) return 'amber';
    return 'green';
}

const BAR_COLORS = {
    red: 'bg-[#ef4444]',
    amber: 'bg-[#f59e0b]',
    green: 'bg-[#22c55e]',
};

function ATSProgressBar({ score, showLabel = true, className = '' }) {
    if (score == null) return null;

    const normalizedScore = Math.min(100, Math.max(0, score));
    const colorKey = getAtsBarColor(normalizedScore);

    return (
        <div className={className}>
            {showLabel && (
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#64748b]">
                        ATS Match
                    </span>
                    <span className="text-sm font-semibold text-[#0f172a]">
                        {normalizedScore}%
                    </span>
                </div>
            )}

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full transition-all duration-200 ease-in-out ${BAR_COLORS[colorKey]}`}
                    style={{ width: `${normalizedScore}%` }}
                />
            </div>
        </div>
    );
}

export default ATSProgressBar;
