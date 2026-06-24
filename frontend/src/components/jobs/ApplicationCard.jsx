import { MapPin, Calendar } from 'lucide-react';

import CompanyAvatar from './CompanyAvatar';
import Badge from '../common/Badge';
import ATSProgressBar from './ATSProgressBar';
import SkillChips from './SkillChips';
import { formatDisplayDate, normalizeAtsScore } from '../../utils/formatters';

function ApplicationCard({
    application,
    variant = 'student',
    children,
    showLocation = true,
}) {
    const job = application.job || {};
    const atsScore = normalizeAtsScore(application.aiScore);
    const skills = job.skillsRequired || job.skills || [];

    if (variant === 'recruiter') {
        const candidate = application.student || {};

        return (
            <article
                className="
                    rounded-2xl
                    border
                    border-[#e2e8f0]
                    bg-white
                    p-5
                    shadow-sm
                    transition-all
                    duration-200
                    ease-in-out
                    hover:-translate-y-[3px]
                    hover:shadow-md
                    sm:p-6
                "
            >
                <div className="flex gap-4">
                    <CompanyAvatar
                        company={candidate.name || 'Candidate'}
                        size="md"
                    />

                    <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-[#0f172a]">
                                    {candidate.name || 'Unknown Candidate'}
                                </h2>
                                <p className="mt-0.5 text-sm text-[#64748b]">
                                    {candidate.email || 'No email provided'}
                                </p>
                            </div>

                            <Badge status={application.status} />
                        </div>

                        {atsScore != null && (
                            <ATSProgressBar score={atsScore} />
                        )}

                        {children}
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article
            className="
                rounded-2xl
                border
                border-[#e2e8f0]
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200
                ease-in-out
                hover:-translate-y-[3px]
                hover:shadow-md
                sm:p-6
            "
        >
            <div className="flex gap-4">
                <CompanyAvatar
                    company={job.company}
                    logoUrl={job.companyLogo}
                />

                <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold tracking-tight text-[#0f172a] sm:text-xl">
                                {job.title || 'Job Title'}
                            </h2>
                            <p className="mt-0.5 text-sm font-medium text-[#64748b]">
                                {job.company || 'Company Name'}
                            </p>
                        </div>

                        <Badge status={application.status} />
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                        <p className="flex items-center gap-1.5">
                            <Calendar
                                className="h-4 w-4 shrink-0"
                                strokeWidth={1.75}
                            />
                            Applied: {formatDisplayDate(application.createdAt)}
                        </p>

                        {showLocation && job.location && (
                            <p className="flex items-center gap-1.5">
                                <MapPin
                                    className="h-4 w-4 shrink-0"
                                    strokeWidth={1.75}
                                />
                                {job.location}
                            </p>
                        )}
                    </div>

                    {skills.length > 0 && <SkillChips skills={skills} />}

                    {atsScore != null && <ATSProgressBar score={atsScore} />}

                    {children}
                </div>
            </div>
        </article>
    );
}

export default ApplicationCard;
