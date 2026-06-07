import { useState, useEffect, useCallback } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import Card from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingStates';
import { getRecruiterDashboard, getRecruiterJobs } from '../../api/jobApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function RecruiterDashboard() {
    const [stats, setStats] = useState({
        postedJobs: 0,
        totalApplications: 0,
        shortlisted: 0,
        rejected: 0,
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data on mount
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch dashboard analytics
            const dashboardData = await getRecruiterDashboard();

            setStats({
                postedJobs: dashboardData.stats?.totalJobs || 0,

                totalApplications: dashboardData.stats?.totalApplications || 0,

                shortlisted: dashboardData.stats?.shortlistedApplications || 0,

                rejected: dashboardData.stats?.rejectedApplications || 0,
            });

            // Fetch recruiter jobs for recent jobs display
            const jobsData = await getRecruiterJobs();
            const jobs = jobsData.jobs || jobsData;

            // Get recent 5 jobs
            setRecentJobs(jobs.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            const errorMsg =
                error.response?.data?.message ||
                'Failed to load dashboard data. Please try again.';
            setError(errorMsg);
            handleApiError(error, errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        Recruiter Dashboard 🚀
                    </h1>
                </div>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error Loading Dashboard</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
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
                    Recruiter Dashboard 🚀
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage jobs, candidates, and hiring analytics.
                </p>
            </div>

            {/* Stats */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                "
            >
                <StatsCard
                    title="Posted Jobs"
                    value={stats.postedJobs}
                    icon="💼"
                />

                <StatsCard
                    title="Applications"
                    value={stats.totalApplications}
                    icon="📋"
                />

                <StatsCard
                    title="Shortlisted"
                    value={stats.shortlisted}
                    icon="✅"
                />

                <StatsCard title="Rejected" value={stats.rejected} icon="❌" />
            </div>

            {/* Recent Jobs */}

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-md
                    p-6
                "
            >
                <h2 className="text-2xl font-bold mb-4">Recent Job Posts</h2>

                {recentJobs.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">
                            No jobs posted yet. Start by posting your first job!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentJobs.map((job) => (
                            <div
                                key={job._id || job.id}
                                className="
                                    border
                                    border-gray-200
                                    rounded-lg
                                    p-4
                                "
                            >
                                <h3 className="font-bold text-lg">
                                    {job.title}
                                </h3>

                                <p className="text-gray-500">
                                    📍 {job.location}
                                </p>

                                <p className="text-blue-600 font-semibold mt-2">
                                    Application Available
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecruiterDashboard;
