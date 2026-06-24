import { useState, useEffect } from 'react';
import { Briefcase, Search } from 'lucide-react';

import JobCard from '../../components/jobs/JobCard';
import PageHeader from '../../components/common/PageHeader';
import {
    JobListSkeleton,
    EmptyState,
} from '../../components/common/LoadingStates';
import SearchFilterBar from '../../components/jobs/SearchFilterBar';
import { getAllJobs } from '../../api/jobApi';
import { applyToJob, getPreApplicationScore } from '../../api/applicationApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import { useAuth } from '../../context/AuthContext';

function StudentJobCard({ job, onApply, applyingJobId }) {
    const [scoreData, setScoreData] = useState(null);
    const [scoreLoading, setScoreLoading] = useState(true);
    const [scoreError, setScoreError] = useState(null);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                setScoreLoading(true);
                setScoreError(null);
                const data = await getPreApplicationScore(job._id || job.id);
                setScoreData(data);
            } catch (error) {
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
                    setScoreError(null);
                }
            } finally {
                setScoreLoading(false);
            }
        };

        fetchScore();
    }, [job._id, job.id]);

    return (
        <JobCard
            job={job}
            showApply
            showViewDetails
            onApply={onApply}
            applying={applyingJobId === (job._id || job.id)}
            applyDisabled={applyingJobId !== null}
            atsScore={scoreData?.score}
            atsLoading={scoreLoading}
            atsError={scoreError}
        />
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

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        let filtered = jobs;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (job) =>
                    (job.title && job.title.toLowerCase().includes(query)) ||
                    (job.company && job.company.toLowerCase().includes(query)),
            );
        }

        if (filters.jobType) {
            filtered = filtered.filter(
                (job) => job.jobType === filters.jobType,
            );
        }

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

    const handleApply = async (jobId) => {
        try {
            setApplyingJobId(jobId);
            await applyToJob(jobId, user?.resumeUrl);
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
        return <JobListSkeleton />;
    }

    const isFiltered = searchQuery || filters.jobType || filters.location;

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Available Jobs"
                description={`${filteredJobs.length} of ${jobs.length} jobs found. Browse and apply for jobs.`}
            />

            <SearchFilterBar onSearch={handleSearch} onFilter={handleFilter} />

            {filteredJobs.length === 0 ? (
                <EmptyState
                    title={isFiltered ? 'No matching jobs' : 'No jobs found'}
                    message={
                        jobs.length === 0
                            ? 'No jobs are available right now. Check back again later.'
                            : 'Try adjusting your search terms or filters to find more opportunities.'
                    }
                    icon={isFiltered ? Search : Briefcase}
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {filteredJobs.map((job) => (
                        <StudentJobCard
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
