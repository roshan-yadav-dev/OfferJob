function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

function FeaturesSection() {
    const features = [
        {
            icon: '🤖',
            title: 'AI Resume Matching',
            description:
                'Intelligent algorithms analyze resumes and match candidates with job requirements with precision.',
        },
        {
            icon: '⭐',
            title: 'Candidate Ranking',
            description:
                'Automatic ranking system identifies top candidates based on skills, experience, and qualifications.',
        },
        {
            icon: '📊',
            title: 'Recruiter Dashboard',
            description:
                'Comprehensive dashboard for managing job postings, applications, and candidate communications.',
        },
        {
            icon: '📝',
            title: 'Resume Builder',
            description:
                'Built-in resume builder helps candidates create professional resumes that stand out.',
        },
        {
            icon: '📧',
            title: 'Email Notifications',
            description:
                'Real-time email notifications keep candidates and recruiters updated on every opportunity.',
        },
        {
            icon: '🔐',
            title: 'Secure Authentication',
            description:
                'Enterprise-grade security ensures all user data is protected and compliant with standards.',
        },
    ];

    return (
        <section className="py-20 bg-gray-50 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need for successful recruitment and job
                        applications
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
