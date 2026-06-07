import { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
    LoadingSpinner,
    EmptyState,
} from '../../components/common/LoadingStates';
import SearchFilterBar from '../../components/jobs/SearchFilterBar';
import { getAllJobs } from '../../api/jobApi';
import { applyToJob, getPreApplicationScore } from '../../api/applicationApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import { useAuth } from '../../context/AuthContext';

function JobCard({ job, onApply, applyingJobId }) {
    const [scoreData, setScoreData] = useState(null);
    const [scoreLoading, setScoreLoading] = useState(true);
    const [scoreError, setScoreError] = useState(null);

    // Fetch AI match score on component mount
    useEffect(() => {
        const fetchScore = async () => {
            try {
                setScoreLoading(true);
                setScoreError(null);
                const data = await getPreApplicationScore(job._id || job.id);
                setScoreData(data);
            } catch (error) {
                // Handle specific error cases gracefully
                if (error.response?.status === 400) {
                    const message = error.response?.data?.message || '';
                    if (message.includes('Resume not uploaded')) {
                        setScoreError('Resume needed');
                    } else if (message.includes('extract')) {
                        setScoreError('Resume error');
                    } else {
                        setScoreError(null);
                    }
                } else {
                    // AI service failures handled silently
                    setScoreError(null);
                }
            } finally {
                setScoreLoading(false);
            }
        };

        fetchScore();
    }, [job._id, job.id]);

    const getScoreBgColor = (category) => {
        if (category === 'Strong Match') return 'bg-green-50 border-green-200';
        if (category === 'Moderate Match')
            return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    const getScoreTextColor = (category) => {
        if (category === 'Strong Match') return 'text-green-700';
        if (category === 'Moderate Match') return 'text-yellow-700';
        return 'text-red-700';
    };

    return (
        <Card>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">{job.title}</h2>

                <p className="text-gray-500">
                    📍 {job.location || 'Location not specified'}
                </p>

                <p className="text-gray-600">
                    {job.description || 'No description provided.'}
                </p>

                <div className="flex gap-4 text-sm text-gray-500 pt-2">
                    {job.experience && <span>💼 {job.experience} years</span>}
                    {job.salary && <span>💰 {job.salary}</span>}
                </div>

                {/* AI Match Score Section */}
                <div className="border-t pt-4 mt-4">
                    {scoreLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Analyzing your match...
                        </div>
                    ) : scoreError ? (
                        <div className="text-xs text-gray-500">
                            {scoreError === 'Resume needed'
                                ? '⚠️ Upload resume to see match score'
                                : '⚠️ Unable to calculate match score'}
                        </div>
                    ) : scoreData ? (
                        <div
                            className={`p-3 rounded-lg border ${getScoreBgColor(scoreData.matchCategory)}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p
                                        className={`text-2xl font-bold ${getScoreTextColor(scoreData.matchCategory)}`}
                                    >
                                        {scoreData.score}%
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${getScoreTextColor(scoreData.matchCategory)}`}
                                    >
                                        {scoreData.matchCategory}
                                    </p>
                                </div>
                                <div className="text-3xl">
                                    {scoreData.matchCategory === 'Strong Match'
                                        ? '✅'
                                        : scoreData.matchCategory ===
                                            'Moderate Match'
                                          ? '⚡'
                                          : '📌'}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <Button
                    variant="primary"
                    onClick={() => onApply(job._id || job.id)}
                    loading={applyingJobId === (job._id || job.id)}
                    disabled={applyingJobId !== null}
                    className="w-full"
                >
                    Apply Now
                </Button>
            </div>
        </Card>
    );
}

function StudentJobs() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ jobType: '', location: '' });

    // Fetch all jobs on mount
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getAllJobs();
            setJobs(data.jobs || data);
        } catch (error) {
            handleApiError(error, 'Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Search handler
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    // Filter handler
    const handleFilter = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    // Apply search and filters to jobs
    useEffect(() => {
        let filtered = jobs;

        // Search by title or company
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (job) =>
                    (job.title && job.title.toLowerCase().includes(query)) ||
                    (job.company && job.company.toLowerCase().includes(query)),
            );
        }

        // Filter by job type
        if (filters.jobType) {
            filtered = filtered.filter(
                (job) => job.jobType === filters.jobType,
            );
        }

        // Filter by location
        if (filters.location.trim()) {
            const locationQuery = filters.location.toLowerCase();
            filtered = filtered.filter(
                (job) =>
                    job.location &&
                    job.location.toLowerCase().includes(locationQuery),
            );
        }

        setFilteredJobs(filtered);
    }, [jobs, searchQuery, filters]);

    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle job application
    const handleApply = async (jobId) => {
        try {
            setApplyingJobId(jobId);

            await applyToJob(jobId, user?.resumeUrl);

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
                <h1 className="text-4xl font-bold text-gray-800">
                    Available Jobs 💼
                </h1>

                <p className="text-gray-500 mt-2">
                    {filteredJobs.length} of {jobs.length} jobs found. Browse
                    and apply for jobs.
                </p>
            </div>

            {/* Search and Filter Bar */}
            <SearchFilterBar onSearch={handleSearch} onFilter={handleFilter} />

            {/* Job Cards */}
            {filteredJobs.length === 0 ? (
                <EmptyState
                    message={
                        jobs.length === 0
                            ? 'No jobs available at the moment. Please check back later.'
                            : 'No jobs match your search or filters. Try adjusting them.'
                    }
                    icon="💼"
                />
            ) : (
                <div className="grid gap-6">
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job._id || job.id}
                            job={job}
                            onApply={handleApply}
                            applyingJobId={applyingJobId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentJobs;
