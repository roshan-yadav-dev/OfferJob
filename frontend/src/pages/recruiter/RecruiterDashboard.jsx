import { useState, useEffect } from 'react';
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
        interviews: 0,
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data on mount
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard analytics
            const dashboardData = await getRecruiterDashboard();

            setStats({
                postedJobs: dashboardData.postedJobs || 0,
                totalApplications: dashboardData.totalApplications || 0,
                shortlisted: dashboardData.shortlisted || 0,
                interviews: dashboardData.interviews || 0,
            });

            // Fetch recruiter jobs for recent jobs display
            const jobsData = await getRecruiterJobs();
            const jobs = jobsData.jobs || jobsData;

            // Get recent 5 jobs
            setRecentJobs(jobs.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            handleApiError(
                error,
                'Failed to load dashboard data. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
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
                <StatsCard title="Posted Jobs" value={stats.postedJobs} />

                <StatsCard
                    title="Applications"
                    value={stats.totalApplications}
                />

                <StatsCard title="Shortlisted" value={stats.shortlisted} />

                <StatsCard title="Interviews" value={stats.interviews} />
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
                                    {job.applicationCount || 0} Applications
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
