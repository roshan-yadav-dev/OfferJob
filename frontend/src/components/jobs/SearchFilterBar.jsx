import { useState } from 'react';
import { Search, MapPin, Briefcase, X } from 'lucide-react';

function SearchFilterBar({ onSearch, onFilter }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    const handleJobTypeChange = (e) => {
        const type = e.target.value;
        setJobType(type);
        onFilter({ jobType: type, location });
    };

    const handleLocationChange = (e) => {
        const loc = e.target.value;
        setLocation(loc);
        onFilter({ jobType, location: loc });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setJobType('');
        setLocation('');
        onSearch('');
        onFilter({ jobType: '', location: '' });
    };

    const hasFilters = searchQuery || jobType || location;

    return (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-4">
                <div className="relative">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]"
                        aria-hidden="true"
                    />
                    <input
                        type="search"
                        placeholder="Search by job title or company..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        aria-label="Search jobs"
                        className="focus-ring w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-4 text-sm transition-all duration-200 ease-in-out placeholder:text-[#94a3b8] hover:border-slate-300 focus:border-[#2563eb]"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="job-type-filter"
                            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0f172a]"
                        >
                            <Briefcase className="h-4 w-4 text-[#64748b]" />
                            Job Type
                        </label>
                        <select
                            id="job-type-filter"
                            value={jobType}
                            onChange={handleJobTypeChange}
                            className="focus-ring w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm transition-all duration-200 ease-in-out hover:border-slate-300 focus:border-[#2563eb]"
                        >
                            <option value="">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="location-filter"
                            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#0f172a]"
                        >
                            <MapPin className="h-4 w-4 text-[#64748b]" />
                            Location
                        </label>
                        <input
                            id="location-filter"
                            type="text"
                            placeholder="Filter by location..."
                            value={location}
                            onChange={handleLocationChange}
                            className="focus-ring w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm transition-all duration-200 ease-in-out placeholder:text-[#94a3b8] hover:border-slate-300 focus:border-[#2563eb]"
                        />
                    </div>
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] transition-colors duration-200 hover:text-[#1d4ed8]"
                    >
                        <X className="h-4 w-4" />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchFilterBar;
