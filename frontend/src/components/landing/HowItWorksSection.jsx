function StepCard({ number, title, description, icon }) {
    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                    {number}
                </div>
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed max-w-xs">
                    {description}
                </p>
            </div>
        </div>
    );
}

function HowItWorksSection() {
    const steps = [
        {
            number: '1',
            title: 'Upload Resume',
            description:
                'Create an account and upload your professional resume or use our resume builder.',
            icon: '📄',
        },
        {
            number: '2',
            title: 'Apply Job',
            description:
                'Browse available job postings and apply to positions that match your skills.',
            icon: '💼',
        },
        {
            number: '3',
            title: 'AI Matching',
            description:
                'Our AI engine analyzes your profile and matches you with suitable job opportunities.',
            icon: '🤖',
        },
        {
            number: '4',
            title: 'Recruiter Review',
            description:
                'Recruiters review your application and contact you for interviews and opportunities.',
            icon: '👥',
        },
    ];

    return (
        <section className="py-20 bg-white px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Simple steps to find your perfect job or hire the right
                        candidate
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {steps.map((step, index) => (
                        <StepCard
                            key={index}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                            icon={step.icon}
                        />
                    ))}
                </div>

                <div className="hidden lg:flex items-center justify-between mt-12 text-blue-300 text-2xl">
                    <div className="flex-grow h-1 bg-blue-200"></div>
                    <div className="px-4">→</div>
                    <div className="flex-grow h-1 bg-blue-200"></div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;
