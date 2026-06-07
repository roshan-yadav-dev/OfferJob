function TestimonialCard({ name, role, company, content, avatar }) {
    return (
        <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {avatar}
                </div>
                <div>
                    <p className="font-bold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-600">
                        {role} at {company}
                    </p>
                </div>
            </div>
            <p className="text-gray-700 italic leading-relaxed">"{content}"</p>
            <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                        ★
                    </span>
                ))}
            </div>
        </div>
    );
}

function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'HR Manager',
            company: 'TechCorp',
            content:
                'The AI matching system cut our hiring time in half. We found our perfect candidates 3x faster than traditional methods.',
            avatar: 'SJ',
        },
        {
            name: 'Mike Chen',
            role: 'Senior Developer',
            company: 'StartupXYZ',
            content:
                'I got hired in 2 weeks using this platform. The resume matching was spot-on and helped me find the perfect role.',
            avatar: 'MC',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Recruiter',
            company: 'GlobalHR',
            content:
                'Best recruitment platform we have used. The AI insights help us make better hiring decisions with data-driven recommendations.',
            avatar: 'ER',
        },
    ];

    return (
        <section className="py-20 bg-white px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        See what recruiters and candidates say about Smart AI
                        Job Portal
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            name={testimonial.name}
                            role={testimonial.role}
                            company={testimonial.company}
                            content={testimonial.content}
                            avatar={testimonial.avatar}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;
