import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ApplicationCard from '../../components/jobs/ApplicationCard';
import {
    ApplicationListSkeleton,
    EmptyState,
} from '../../components/common/LoadingStates';

import {
    getJobApplicants,
    updateApplicationStatus,
} from '../../api/applicationApi';

import { getRecruiterJobs } from '../../api/jobApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import { resolveResumeUrl } from '../../utils/resolveResumeUrl';

function Candidates() {
    const [applicants, setApplicants] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);

    const sortByAIScore = (applicantsList) => {
        return [...applicantsList].sort((a, b) => {
            const scoreA = a.aiScore ?? -1;
            const scoreB = b.aiScore ?? -1;
            return scoreB - scoreA;
        });
    };

    const fetchApplicants = async (jobId) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getJobApplicants(jobId);

            const applicantsList = data.applications || data || [];
            const sortedApplicants = sortByAIScore(applicantsList);

            setApplicants(sortedApplicants);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || 'Failed to load applicants';
            setError(errorMsg);
            handleApiError(err, errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecruiterJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getRecruiterJobs();

            const recruiterJobs = data.jobs || data || [];

            setJobs(recruiterJobs);

            if (recruiterJobs.length > 0) {
                const firstJobId = recruiterJobs[0]._id;

                setSelectedJob(firstJobId);

                await fetchApplicants(firstJobId);
            }
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                'Failed to load recruiter jobs';
            setError(errorMsg);
            handleApiError(err, errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecruiterJobs();
    }, []);

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            setUpdatingId(applicationId);

            await updateApplicationStatus(applicationId, status);

            setApplicants((prev) =>
                prev.map((applicant) =>
                    applicant._id === applicationId
                        ? { ...applicant, status }
                        : applicant,
                ),
            );
        } catch (err) {
            handleApiError(err, 'Failed to update status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleViewResume = (resumeUrl) => {
        const normalizedResumeUrl = resolveResumeUrl(resumeUrl);

        if (normalizedResumeUrl) {
            window.open(normalizedResumeUrl, '_blank');
        }
    };

    const handleDownloadResume = (resumeUrl, candidateName) => {
        const normalizedResumeUrl = resolveResumeUrl(resumeUrl);

        if (!normalizedResumeUrl) return;

        try {
            const link = document.createElement('a');
            link.href = normalizedResumeUrl;
            link.download = `${candidateName}_resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            handleApiError(err, 'Failed to download resume');
        }
    };

    if (loading) {
        return <ApplicationListSkeleton />;
    }

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader title="Candidates" />
                <div
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                    role="alert"
                >
                    <p className="font-semibold">Error Loading Candidates</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Candidates"
                description="View and manage applicants."
            />

            {jobs.length > 0 && (
                <div>
                    <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                        Select Job
                    </label>

                    <select
                        value={selectedJob}
                        onChange={(e) => {
                            setSelectedJob(e.target.value);
                            fetchApplicants(e.target.value);
                        }}
                        className="rounded-xl border border-[#e2e8f0] px-4 py-2.5 outline-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-[#2563eb]"
                    >
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {applicants.length === 0 ? (
                    <div className="md:col-span-2">
                        <EmptyState
                            title="No applicants yet"
                            message="No applicants for this job yet."
                            icon={Users}
                        />
                    </div>
                ) : (
                    applicants.map((applicant) => (
                        <ApplicationCard
                            key={applicant._id}
                            application={applicant}
                            variant="recruiter"
                        >
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        handleStatusUpdate(
                                            applicant._id,
                                            'shortlisted',
                                        )
                                    }
                                    loading={updatingId === applicant._id}
                                    disabled={updatingId !== null}
                                >
                                    Shortlist
                                </Button>

                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleStatusUpdate(
                                            applicant._id,
                                            'rejected',
                                        )
                                    }
                                    loading={updatingId === applicant._id}
                                    disabled={updatingId !== null}
                                >
                                    Reject
                                </Button>
                            </div>

                            {resolveResumeUrl(applicant.resumeUrl) && (
                                <div className="flex flex-wrap gap-3 border-t border-[#e2e8f0] pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleViewResume(applicant.resumeUrl)
                                        }
                                    >
                                        View Resume
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            handleDownloadResume(
                                                applicant.resumeUrl,
                                                applicant.student?.name ||
                                                    'resume',
                                            )
                                        }
                                    >
                                        Download Resume
                                    </Button>
                                </div>
                            )}
                        </ApplicationCard>
                    ))
                )}
            </div>
        </div>
    );
}

export default Candidates;
