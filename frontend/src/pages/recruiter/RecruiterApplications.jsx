import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import JobCard from '../../components/jobs/JobCard';
import {
    ApplicationListSkeleton,
    EmptyState,
} from '../../components/common/LoadingStates';

import { getRecruiterJobs } from '../../api/jobApi';
import { getJobApplicants } from '../../api/applicationApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function RecruiterApplications() {
    const [jobsWithApplications, setJobsWithApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobsWithApplications();
    }, []);

    const fetchJobsWithApplications = async () => {
        try {
            setLoading(true);

            const jobsData = await getRecruiterJobs();
            const recruiterJobs = jobsData.jobs || jobsData || [];

            const jobsWithApps = await Promise.all(
                recruiterJobs.map(async (job) => {
                    try {
                        const appData = await getJobApplicants(job._id);
                        const applications =
                            appData.applications || appData || [];

                        return {
                            ...job,
                            applicationCount: applications.length,
                            applications,
                        };
                    } catch {
                        return {
                            ...job,
                            applicationCount: 0,
                            applications: [],
                        };
                    }
                }),
            );

            setJobsWithApplications(jobsWithApps);
        } catch (error) {
            handleApiError(error, 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ApplicationListSkeleton />;
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Job Applications"
                description="Manage all received applications."
            />

            {jobsWithApplications.length === 0 ? (
                <EmptyState
                    title="No job postings yet"
                    message="Create a job posting to start receiving applications from candidates."
                    icon={FileText}
                    actionLabel="Post a Job"
                    actionTo="/recruiter/post-job"
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {jobsWithApplications.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                            status={
                                job.applicationCount > 0 ? 'active' : 'inactive'
                            }
                            showViewDetails={false}
                            footer={
                                <p className="text-sm font-medium text-[#64748b]">
                                    {job.applicationCount}{' '}
                                    {job.applicationCount === 1
                                        ? 'application'
                                        : 'applications'}{' '}
                                    received
                                </p>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecruiterApplications;
