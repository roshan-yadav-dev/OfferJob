import { useEffect, useState } from 'react';

import Card from '../../components/common/Card';
import {
    LoadingSpinner,
    EmptyState,
} from '../../components/common/LoadingStates';

import { getRecruiterJobs } from '../../api/jobApi';
import { getJobApplicants } from '../../api/applicationApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function RecruiterApplications() {
    const [jobs, setJobs] = useState([]);
    const [jobsWithApplications, setJobsWithApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobsWithApplications();
    }, []);

    const fetchJobsWithApplications = async () => {
        try {
            setLoading(true);

            // Fetch all recruiter jobs
            const jobsData = await getRecruiterJobs();
            const recruiterJobs = jobsData.jobs || jobsData || [];

            setJobs(recruiterJobs);

            // Fetch applications for each job
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
                    } catch (error) {
                        console.error(
                            `Failed to fetch applications for job ${job._id}`,
                            error,
                        );

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
            console.error(error);

            handleApiError(error, 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading applications..." />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1
                    className="
                        text-4xl
                        font-bold
                        text-gray-800
                    "
                >
                    Job Applications 📄
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage all received applications.
                </p>
            </div>

            {jobsWithApplications.length === 0 ? (
                <EmptyState
                    message="No job postings yet. Create a job to start receiving applications."
                    icon="📭"
                />
            ) : (
                <Card>
                    <div className="space-y-5">
                        {jobsWithApplications.map((job) => (
                            <div
                                key={job._id}
                                className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-4
                                    last:border-b-0
                                "
                            >
                                <div>
                                    <h2 className="font-bold text-xl">
                                        {job.title}
                                    </h2>

                                    <p className="text-gray-500">
                                        {job.applicationCount}{' '}
                                        {job.applicationCount === 1
                                            ? 'Application'
                                            : 'Applications'}
                                    </p>
                                </div>

                                <span
                                    className={`
                                        ${
                                            job.applicationCount > 0
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                    `}
                                >
                                    {job.applicationCount > 0
                                        ? 'Active'
                                        : 'No Applications'}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default RecruiterApplications;
