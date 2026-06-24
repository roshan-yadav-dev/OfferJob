import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Building2, FileText, Target } from 'lucide-react';

import Button from '../common/Button';

const heroStats = [
    { icon: Briefcase, value: '500+', label: 'Active Jobs' },
    { icon: Building2, value: '150+', label: 'Companies' },
    { icon: FileText, value: '1200+', label: 'Applications' },
    { icon: Target, value: '85%', label: 'Match Accuracy' },
];

function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#f8fafc] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

            <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-medium text-[#2563eb] shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
                        AI recruitment platform for students & recruiters
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                            Find the Right Opportunity Faster
                        </h1>
                        <p className="max-w-xl text-lg leading-relaxed text-[#64748b] sm:text-xl">
                            AI-powered job matching, resume analysis, and
                            application tracking built for students and
                            recruiters.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button
                                variant="primary"
                                className="w-full rounded-xl px-6 py-3 text-base sm:w-auto"
                            >
                                Get Started
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link to="/jobs" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="w-full rounded-xl px-6 py-3 text-base sm:w-auto"
                            >
                                Browse Jobs
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-lg sm:p-8">
                    <div className="mb-6">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#64748b]">
                            Platform Statistics
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-[#0f172a]">
                            Hiring momentum in real time
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {heroStats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-sm"
                            >
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                                    <stat.icon
                                        className="h-4 w-4 text-[#2563eb]"
                                        strokeWidth={1.75}
                                    />
                                </div>
                                <p className="text-2xl font-bold text-[#0f172a]">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs font-medium text-[#64748b]">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
