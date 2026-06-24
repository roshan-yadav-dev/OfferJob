import { useState, useEffect, useCallback } from 'react';
import {
    Briefcase,
    FileText,
    CheckCircle,
    XCircle,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import JobCard from '../../components/jobs/JobCard';
import { DashboardPageSkeleton } from '../../components/common/LoadingStates';
import { getRecruiterDashboard, getRecruiterJobs } from '../../api/jobApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import {
    formatConversionRate,
    formatRejectedInsight,
} from '../../utils/dashboardInsights';

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
        return <DashboardPageSkeleton />;
    }

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader title="Recruiter Dashboard" />
                <div
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                    role="alert"
                >
                    <p className="font-semibold">Error Loading Dashboard</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Recruiter Dashboard"
                description="Manage jobs, candidates, and hiring analytics."
            />

            {/* Stats */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Posted Jobs"
                    value={stats.postedJobs}
                    subtitle={
                        recentJobs.length > 0
                            ? `${recentJobs.length} active listings`
                            : 'Post your first job'
                    }
                    icon={Briefcase}
                    color="blue"
                />

                <StatsCard
                    title="Applications"
                    value={stats.totalApplications}
                    subtitle="Across all job listings"
                    icon={FileText}
                    color="blue"
                />

                <StatsCard
                    title="Shortlisted"
                    value={stats.shortlisted}
                    subtitle={formatConversionRate(
                        stats.shortlisted,
                        stats.totalApplications,
                    )}
                    icon={CheckCircle}
                    color="green"
                />

                <StatsCard
                    title="Rejected"
                    value={stats.rejected}
                    subtitle={formatRejectedInsight(stats.rejected)}
                    icon={XCircle}
                    color="red"
                />
            </div>

            {/* Recent Jobs */}

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-[#0f172a]">
                    Recent Job Posts
                </h2>

                {recentJobs.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-lg text-[#64748b]">
                            No jobs posted yet. Start by posting your first job!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {recentJobs.map((job) => (
                            <JobCard
                                key={job._id || job.id}
                                job={job}
                                compact
                                showViewDetails={false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecruiterDashboard;
