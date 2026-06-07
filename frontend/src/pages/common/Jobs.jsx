import { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import {
    LoadingSpinner,
    EmptyState,
} from '../../components/common/LoadingStates';
import SearchFilterBar from '../../components/jobs/SearchFilterBar';
import { getAllJobs } from '../../api/jobApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ jobType: '', location: '' });

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

    if (loading) {
        return <LoadingSpinner message="Loading jobs..." />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Job Listings 💼
                </h1>
                <p className="text-gray-500 mt-2">
                    {filteredJobs.length} of {jobs.length} jobs found. Find your
                    next opportunity.
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
                        <Card key={job._id || job.id}>
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {job.title}
                                        </h2>
                                        <p className="text-lg text-blue-600 font-medium">
                                            {job.company ||
                                                'Company not specified'}
                                        </p>
                                    </div>
                                    {job.jobType && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                            {job.jobType}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-500">
                                    📍{' '}
                                    {job.location || 'Location not specified'}
                                </p>

                                <p className="text-gray-600 line-clamp-2">
                                    {job.description ||
                                        'No description provided.'}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-2 border-t border-gray-200">
                                    {job.experience && (
                                        <span>
                                            💼 {job.experience} years experience
                                        </span>
                                    )}
                                    {job.salary && <span>💰 {job.salary}</span>}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Jobs;
