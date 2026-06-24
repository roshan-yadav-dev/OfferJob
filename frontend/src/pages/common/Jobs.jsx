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
import { handleApiError } from '../../utils/apiErrorHandler';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ jobType: '', location: '' });

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

    if (loading) {
        return <JobListSkeleton />;
    }

    const isFiltered = searchQuery || filters.jobType || filters.location;

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Job Listings"
                description={`${filteredJobs.length} of ${jobs.length} jobs found. Find your next opportunity.`}
            />

            <SearchFilterBar onSearch={handleSearch} onFilter={handleFilter} />

            {filteredJobs.length === 0 ? (
                <EmptyState
                    title={isFiltered ? 'No matching jobs' : 'No jobs found'}
                    message={
                        jobs.length === 0
                            ? 'No jobs are available right now. Check back again later.'
                            : 'Try adjusting your search terms or filters to discover more roles.'
                    }
                    icon={isFiltered ? Search : Briefcase}
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job._id || job.id}
                            job={job}
                            showViewDetails
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Jobs;
