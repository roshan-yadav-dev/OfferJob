import {
    Sparkles,
    FileSearch,
    ClipboardList,
    LayoutDashboard,
    Bell,
    Users,
} from 'lucide-react';

import FeatureCard from './FeatureCard';

const features = [
    {
        icon: Sparkles,
        title: 'AI Job Matching',
        description:
            'Intelligent algorithms match students with roles based on skills, experience, and career goals.',
    },
    {
        icon: FileSearch,
        title: 'Resume Analysis',
        description:
            'Deep resume parsing highlights strengths, gaps, and ATS compatibility before you apply.',
    },
    {
        icon: ClipboardList,
        title: 'Application Tracking',
        description:
            'Track every application stage from submission to shortlist with a unified dashboard.',
    },
    {
        icon: LayoutDashboard,
        title: 'Recruiter Dashboard',
        description:
            'Manage postings, review candidates, and move hiring pipelines forward in one place.',
    },
    {
        icon: Bell,
        title: 'Smart Notifications',
        description:
            'Stay informed with timely updates on applications, interviews, and recruiter actions.',
    },
    {
        icon: Users,
        title: 'Candidate Insights',
        description:
            'AI-ranked candidate profiles help recruiters identify top talent faster and with confidence.',
    },
];

function FeatureGrid() {
    return (
        <section className="bg-[#f8fafc] px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        Everything you need to hire and get hired
                    </h2>
                    <p className="mt-3 text-base text-[#64748b] sm:text-lg">
                        Built for modern students and recruiters who expect
                        speed, clarity, and AI-powered decisions.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeatureGrid;
