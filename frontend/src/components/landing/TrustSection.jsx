const partners = [
    { name: 'TechNova', initials: 'TN' },
    { name: 'HireFlow', initials: 'HF' },
    { name: 'CampusEdge', initials: 'CE' },
    { name: 'TalentGrid', initials: 'TG' },
];

function TrustSection() {
    return (
        <section className="border-y border-[#e2e8f0] bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-[#64748b]">
                    Trusted by students and recruiters
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="flex items-center justify-center gap-3 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#2563eb] shadow-sm">
                                {partner.initials}
                            </div>
                            <span className="text-sm font-semibold text-[#0f172a]">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TrustSection;
