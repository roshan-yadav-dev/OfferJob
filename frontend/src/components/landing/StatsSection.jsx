import { Briefcase, FileText, GraduationCap, Building2 } from 'lucide-react';

import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

function StatItem({ icon: Icon, label, value, suffix = '' }) {
    const { value: animatedValue, ref } = useAnimatedCounter(value);

    return (
        <div
            ref={ref}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center shadow-sm"
        >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Icon className="h-5 w-5 text-[#2563eb]" strokeWidth={1.75} />
            </div>
            <p className="text-3xl font-bold text-[#0f172a]">
                {animatedValue.toLocaleString()}
                {suffix}
            </p>
            <p className="mt-1 text-sm text-[#64748b]">{label}</p>
        </div>
    );
}

const platformMetrics = [
    { icon: Briefcase, label: 'Jobs Posted', value: 500, suffix: '+' },
    { icon: FileText, label: 'Applications Processed', value: 1200, suffix: '+' },
    { icon: GraduationCap, label: 'Students Registered', value: 850, suffix: '+' },
    { icon: Building2, label: 'Recruiters Registered', value: 150, suffix: '+' },
];

function StatsSection() {
    return (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        Platform impact at a glance
                    </h2>
                    <p className="mt-3 text-base text-[#64748b] sm:text-lg">
                        Real momentum across hiring, applications, and community
                        growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {platformMetrics.map((metric) => (
                        <StatItem key={metric.label} {...metric} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default StatsSection;
