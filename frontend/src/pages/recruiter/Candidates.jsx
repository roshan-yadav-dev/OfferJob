import { useEffect, useState, useCallback } from 'react';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
    LoadingSpinner,
    EmptyState,
} from '../../components/common/LoadingStates';

import {
    getJobApplicants,
    updateApplicationStatus,
} from '../../api/applicationApi';

import { getRecruiterJobs } from '../../api/jobApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function Candidates() {
    const [applicants, setApplicants] = useState([]);

    const [jobs, setJobs] = useState([]);

    const [selectedJob, setSelectedJob] = useState('');

    const [loading, setLoading] = useState(true);

    const [updatingId, setUpdatingId] = useState(null);

    // Fetch applicants for selected job
    const fetchApplicants = useCallback(async (jobId) => {
        try {
            setLoading(true);

            const data = await getJobApplicants(jobId);

            setApplicants(data.applications || data || []);
        } catch (error) {
            console.error(error);

            handleApiError(error, 'Failed to load applicants');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch recruiter jobs
    const fetchRecruiterJobs = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getRecruiterJobs();

            const recruiterJobs = data.jobs || data || [];

            setJobs(recruiterJobs);

            // Auto select first recruiter job
            if (recruiterJobs.length > 0) {
                const firstJobId = recruiterJobs[0]._id;

                setSelectedJob(firstJobId);

                await fetchApplicants(firstJobId);
            }
        } catch (error) {
            console.error(error);

            handleApiError(error, 'Failed to load recruiter jobs');
        } finally {
            setLoading(false);
        }
    }, [fetchApplicants]);

    // Fetch recruiter jobs on mount

    useEffect(() => {
        (async () => {
            await fetchRecruiterJobs();
        })();
    }, []);

    // Update applicant status
    const handleStatusUpdate = async (applicationId, status) => {
        try {
            setUpdatingId(applicationId);

            await updateApplicationStatus(applicationId, status);

            // Instant UI update
            setApplicants((prev) =>
                prev.map((applicant) =>
                    applicant._id === applicationId
                        ? {
                              ...applicant,
                              status,
                          }
                        : applicant,
                ),
            );
        } catch (error) {
            console.error(error);

            handleApiError(error, 'Failed to update status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    // Loading state
    if (loading) {
        return <LoadingSpinner message="Loading candidates..." />;
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
                    Candidates 👨‍💻
                </h1>

                <p className="text-gray-500 mt-2">
                    View and manage applicants.
                </p>
            </div>

            {/* Job Selector */}

            {jobs.length > 0 && (
                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Select Job
                    </label>

                    <select
                        value={selectedJob}
                        onChange={(e) => {
                            setSelectedJob(e.target.value);

                            fetchApplicants(e.target.value);
                        }}
                        className="
                            border
                            border-gray-300
                            rounded-lg
                            px-4
                            py-2
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    >
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Applicants List */}

            <div className="grid gap-6">
                {applicants.length === 0 ? (
                    <EmptyState
                        message="No applicants for this job yet."
                        icon="👥"
                    />
                ) : (
                    applicants.map((applicant) => (
                        <Card key={applicant._id}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {applicant.student?.name || 'Unknown'}
                                    </h2>

                                    <p className="text-gray-500">
                                        {applicant.student?.email || 'No email'}
                                    </p>

                                    <p className="font-semibold text-blue-600 mt-2">
                                        Status:{' '}
                                        <span
                                            className={`
                                                ${
                                                    applicant.status ===
                                                    'shortlisted'
                                                        ? 'text-green-600'
                                                        : applicant.status ===
                                                            'rejected'
                                                          ? 'text-red-600'
                                                          : 'text-yellow-600'
                                                }
                                            `}
                                        >
                                            {applicant.status || 'Pending'}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="success"
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
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default Candidates;
