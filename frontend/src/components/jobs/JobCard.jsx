import { useState } from 'react';
import { MapPin, Clock } from 'lucide-react';

import Button from '../common/Button';
import CompanyAvatar from './CompanyAvatar';
import SkillChips from './SkillChips';
import ATSProgressBar from './ATSProgressBar';
import Badge from '../common/Badge';
import { formatRelativeDate } from '../../utils/formatters';

function JobCard({
    job,
    onApply,
    onViewDetails,
    applying = false,
    applyDisabled = false,
    showApply = false,
    showViewDetails = true,
    status,
    atsScore,
    atsLoading = false,
    atsError,
    footer,
    compact = false,
}) {
    const [expanded, setExpanded] = useState(false);

    const skills = job.skillsRequired || job.skills || [];
    const postedAt = job.createdAt || job.postedAt;

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(job);
            return;
        }

        setExpanded((prev) => !prev);
    };

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
                    size={compact ? 'sm' : 'md'}
                />

                <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold tracking-tight text-[#0f172a] sm:text-xl">
                                {job.title}
                            </h2>
                            <p className="mt-0.5 text-sm font-medium text-[#64748b]">
                                {job.company || 'Company not specified'}
                            </p>
                        </div>

                        {status && <Badge status={status} />}
                    </div>

                    <p className="flex items-center gap-1.5 text-sm text-[#64748b]">
                        <MapPin
                            className="h-4 w-4 shrink-0"
                            strokeWidth={1.75}
                        />
                        {job.location || 'Location not specified'}
                    </p>

                    {!compact && skills.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                                Skills
                            </p>
                            <SkillChips skills={skills} />
                        </div>
                    )}

                    {postedAt && (
                        <p className="flex items-center gap-1.5 text-xs text-[#64748b]">
                            <Clock
                                className="h-3.5 w-3.5"
                                strokeWidth={1.75}
                            />
                            Posted {formatRelativeDate(postedAt)}
                        </p>
                    )}

                    {(expanded || compact) && job.description && (
                        <p
                            className={`text-sm leading-relaxed text-[#64748b] ${!expanded ? 'line-clamp-3' : ''}`}
                        >
                            {job.description}
                        </p>
                    )}

                    {(showApply || atsScore != null || atsLoading || atsError) && (
                        <div className="border-t border-[#e2e8f0] pt-4">
                            {atsLoading ? (
                                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
                                    Analyzing your match...
                                </div>
                            ) : atsError ? (
                                <p className="text-xs text-[#64748b]">
                                    {atsError === 'Resume needed'
                                        ? 'Upload resume to see ATS match'
                                        : 'Unable to calculate ATS match'}
                                </p>
                            ) : atsScore != null ? (
                                <ATSProgressBar score={atsScore} />
                            ) : null}
                        </div>
                    )}

                    {(showApply || showViewDetails || footer) && (
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            {showViewDetails && (
                                <Button
                                    variant="outline"
                                    onClick={handleViewDetails}
                                    className="cursor-pointer"
                                >
                                    {expanded ? 'Hide Details' : 'View Details'}
                                </Button>
                            )}

                            {showApply && (
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        onApply?.(job._id || job.id)
                                    }
                                    loading={applying}
                                    disabled={applyDisabled}
                                    className="cursor-pointer"
                                >
                                    Apply
                                </Button>
                            )}

                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export default JobCard;
