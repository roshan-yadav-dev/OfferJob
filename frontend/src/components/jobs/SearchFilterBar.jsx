import { useState, useCallback } from 'react';

function SearchFilterBar({ onSearch, onFilter }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');

    const handleSearchChange = useCallback(
        (e) => {
            const query = e.target.value;
            setSearchQuery(query);
            onSearch(query);
        },
        [onSearch],
    );

    const handleJobTypeChange = useCallback(
        (e) => {
            const type = e.target.value;
            setJobType(type);
            onFilter({ jobType: type, location });
        },
        [location, onFilter],
    );

    const handleLocationChange = useCallback(
        (e) => {
            const loc = e.target.value;
            setLocation(loc);
            onFilter({ jobType, location: loc });
        },
        [jobType, onFilter],
    );

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setJobType('');
        setLocation('');
        onSearch('');
        onFilter({ jobType: '', location: '' });
    }, [onSearch, onFilter]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {/* Search Bar */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔍 Search Jobs
                </label>
                <input
                    type="text"
                    placeholder="Search by job title or company name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        💼 Job Type
                    </label>
                    <select
                        value={jobType}
                        onChange={handleJobTypeChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>

                {/* Location Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        📍 Location
                    </label>
                    <input
                        type="text"
                        placeholder="Filter by location..."
                        value={location}
                        onChange={handleLocationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Clear Button */}
            {(searchQuery || jobType || location) && (
                <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    ✕ Clear Filters
                </button>
            )}
        </div>
    );
}

export default SearchFilterBar;
