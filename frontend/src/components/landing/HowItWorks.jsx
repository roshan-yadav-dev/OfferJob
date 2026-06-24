import { Upload, Sparkles, Send, PlusCircle, Users, Rocket } from 'lucide-react';

const studentSteps = [
    {
        number: 1,
        icon: Upload,
        title: 'Upload Resume',
        description:
            'Create your profile and upload a resume to unlock AI insights.',
    },
    {
        number: 2,
        icon: Sparkles,
        title: 'Get AI Matching',
        description:
            'Receive personalized job matches based on skills and experience.',
    },
    {
        number: 3,
        icon: Send,
        title: 'Apply Instantly',
        description:
            'Apply to matched roles and track every application in one place.',
    },
];

const recruiterSteps = [
    {
        number: 1,
        icon: PlusCircle,
        title: 'Post Jobs',
        description:
            'Publish roles with requirements and reach qualified candidates.',
    },
    {
        number: 2,
        icon: Users,
        title: 'Review Candidates',
        description:
            'Review AI-ranked applicants and shortlist top talent quickly.',
    },
    {
        number: 3,
        icon: Rocket,
        title: 'Hire Faster',
        description:
            'Move candidates through your pipeline with less manual screening.',
    },
];

function StepColumn({ title, subtitle, steps, accent }) {
    return (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
                <p
                    className={`text-sm font-semibold uppercase tracking-wide ${accent}`}
                >
                    {subtitle}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-[#0f172a]">
                    {title}
                </h3>
            </div>

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={step.title} className="relative flex gap-4">
                        {index < steps.length - 1 && (
                            <span className="absolute left-5 top-12 h-[calc(100%-8px)] w-px bg-[#e2e8f0]" />
                        )}

                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-sm font-bold text-white">
                            {step.number}
                        </div>

                        <div className="min-w-0 pb-2">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                                <step.icon
                                    className="h-4 w-4 text-[#2563eb]"
                                    strokeWidth={1.75}
                                />
                            </div>
                            <h4 className="font-semibold text-[#0f172a]">
                                {step.title}
                            </h4>
                            <p className="mt-1 text-sm leading-relaxed text-[#64748b]">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HowItWorks() {
    return (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mt-3 text-base text-[#64748b] sm:text-lg">
                        Simple workflows for students and recruiters — designed
                        to reduce friction at every step.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <StepColumn
                        title="For Students"
                        subtitle="Students"
                        steps={studentSteps}
                        accent="text-[#2563eb]"
                    />
                    <StepColumn
                        title="For Recruiters"
                        subtitle="Recruiters"
                        steps={recruiterSteps}
                        accent="text-[#7c3aed]"
                    />
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
