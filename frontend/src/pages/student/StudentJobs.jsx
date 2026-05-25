import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
    LoadingSpinner,
    EmptyState,
} from '../../components/common/LoadingStates';
import { getAllJobs } from '../../api/jobApi';
import { applyToJob } from '../../api/applicationApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function StudentJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingJobId, setApplyingJobId] = useState(null);

    // Fetch all jobs on mount
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getAllJobs();
            setJobs(data.jobs || data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            handleApiError(error, 'Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle job application
    const handleApply = async (jobId) => {
        try {
            setApplyingJobId(jobId);

            const response = await applyToJob(jobId);

            // Refresh jobs to get updated application count if needed
            await fetchJobs();
        } catch (error) {
            console.error('Failed to apply:', error);

            handleApiError(
                error,
                'Failed to submit application. Please try again.',
            );
        } finally {
            setApplyingJobId(null);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading jobs..." />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}

            <div>
                <h1
                    className="
                        text-4xl
                        font-bold
                        text-gray-800
                    "
                >
                    Available Jobs 💼
                </h1>

                <p className="text-gray-500 mt-2">
                    {jobs.length} jobs found. Browse and apply for jobs.
                </p>
            </div>

            {/* Job Cards */}

            {jobs.length === 0 ? (
                <EmptyState
                    message="No jobs available at the moment. Please check back later."
                    icon="💼"
                />
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <Card key={job._id || job.id}>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold">
                                    {job.title}
                                </h2>

                                <p className="text-gray-500">
                                    📍{' '}
                                    {job.location || 'Location not specified'}
                                </p>

                                <p className="text-gray-600">
                                    {job.description ||
                                        'No description provided.'}
                                </p>

                                <div className="flex gap-4 text-sm text-gray-500 pt-2">
                                    {job.experience && (
                                        <span>💼 {job.experience} years</span>
                                    )}
                                    {job.salary && <span>💰 {job.salary}</span>}
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        handleApply(job._id || job.id)
                                    }
                                    loading={
                                        applyingJobId === (job._id || job.id)
                                    }
                                    disabled={applyingJobId !== null}
                                >
                                    Apply Now
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentJobs;
