import { useState, useEffect } from 'react';
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    BarChart3,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import ApplicationCard from '../../components/jobs/ApplicationCard';
import ATSProgressBar from '../../components/jobs/ATSProgressBar';
import { DashboardPageSkeleton } from '../../components/common/LoadingStates';
import { getStudentDashboard } from '../../api/applicationApi';
import {
    calculateAverageAtsScore,
    countApplicationsThisWeek,
    formatAtsInsight,
    formatConversionRate,
    formatRejectedInsight,
    formatWeeklyInsight,
} from '../../utils/dashboardInsights';
import { normalizeAtsScore } from '../../utils/formatters';

function StudentDashboard() {
    const [stats, setStats] = useState({
        totalApplications: 0,
        appliedCount: 0,
        shortlistedCount: 0,
        rejectedCount: 0,
        recentApplications: [],
        latestAtsScores: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await getStudentDashboard();
                if (response.success) {
                    setStats(response.stats);
                }
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const weeklyApplications = countApplicationsThisWeek(
        stats.recentApplications,
    );
    const averageAtsScore = calculateAverageAtsScore(stats.latestAtsScores);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Welcome Back"
                description="Track jobs, applications, and resume progress."
            />

            {error && (
                <div
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Applications"
                    value={stats.totalApplications}
                    subtitle={formatWeeklyInsight(weeklyApplications)}
                    icon={FileText}
                    color="blue"
                />
                <StatsCard
                    title="Pending"
                    value={stats.appliedCount}
                    subtitle={
                        stats.appliedCount > 0
                            ? 'Awaiting recruiter review'
                            : 'No pending applications'
                    }
                    icon={Clock}
                    color="amber"
                />
                <StatsCard
                    title="Shortlisted"
                    value={stats.shortlistedCount}
                    subtitle={formatConversionRate(
                        stats.shortlistedCount,
                        stats.totalApplications,
                    )}
                    icon={CheckCircle}
                    color="green"
                />
                <StatsCard
                    title="Rejected"
                    value={stats.rejectedCount}
                    subtitle={formatRejectedInsight(stats.rejectedCount)}
                    icon={XCircle}
                    color="red"
                />
                {averageAtsScore != null && (
                    <StatsCard
                        title="Avg ATS Score"
                        value={`${averageAtsScore}%`}
                        subtitle={formatAtsInsight(averageAtsScore)}
                        icon={BarChart3}
                        color="purple"
                        progressValue={averageAtsScore}
                    />
                )}
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-[#0f172a]">
                    Recent Applications
                </h2>
                {stats.recentApplications?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {stats.recentApplications.map((app) => (
                            <ApplicationCard
                                key={app._id}
                                application={app}
                                showLocation={false}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-[#64748b]">No applications yet.</p>
                )}
            </div>

            {stats.latestAtsScores?.length > 0 && (
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-[#0f172a]">
                        Latest ATS Scores
                    </h2>
                    <div className="space-y-4">
                        {stats.latestAtsScores.map((app) => (
                            <div
                                key={app._id}
                                className="rounded-xl border border-[#e2e8f0] bg-slate-50 p-4"
                            >
                                <p className="mb-3 text-sm font-medium text-[#0f172a]">
                                    {app.job?.title || 'Job Title'} at{' '}
                                    {app.job?.company || 'Company'}
                                </p>
                                <ATSProgressBar
                                    score={normalizeAtsScore(app.aiScore)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;
