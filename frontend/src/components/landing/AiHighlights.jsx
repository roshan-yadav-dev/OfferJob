import {
    FileSearch,
    Target,
    Layers,
    TrendingUp,
} from 'lucide-react';

const highlights = [
    {
        icon: FileSearch,
        title: 'Resume Analysis',
        description:
            'Parse resumes instantly and surface role-relevant experience.',
        progress: 92,
        color: 'bg-[#2563eb]',
    },
    {
        icon: Target,
        title: 'ATS Compatibility',
        description:
            'Score resumes against job descriptions for ATS readiness.',
        progress: 85,
        color: 'bg-[#22c55e]',
    },
    {
        icon: Layers,
        title: 'Skill Matching',
        description:
            'Map candidate skills to role requirements with precision.',
        progress: 88,
        color: 'bg-[#7c3aed]',
    },
    {
        icon: TrendingUp,
        title: 'Candidate Ranking',
        description:
            'Rank applicants by fit so recruiters focus on top matches.',
        progress: 90,
        color: 'bg-[#f59e0b]',
    },
];

function AiHighlights() {
    return (
        <section className="bg-[#f8fafc] px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#2563eb]">
                        Platform Intelligence
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        AI-Powered Recruitment
                    </h2>
                    <p className="mt-3 text-base text-[#64748b] sm:text-lg">
                        From resume parsing to candidate ranking, every step is
                        enhanced by machine learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {highlights.map((item) => (
                        <article
                            key={item.title}
                            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:shadow-md"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                    <item.icon
                                        className="h-5 w-5 text-[#2563eb]"
                                        strokeWidth={1.75}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-semibold text-[#0f172a]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-[#64748b]">
                                        {item.description}
                                    </p>

                                    <div className="mt-4">
                                        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#64748b]">
                                            <span>Accuracy</span>
                                            <span className="text-[#0f172a]">
                                                {item.progress}%
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className={`h-full rounded-full ${item.color}`}
                                                style={{
                                                    width: `${item.progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AiHighlights;
