import { useEffect, useState } from 'react';
import {
    Users,
    Building2,
    GraduationCap,
    Briefcase,
    FileText,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import Card from '../../components/common/Card';
import { DashboardPageSkeleton } from '../../components/common/LoadingStates';
import { getAdminAnalytics } from '../../api/adminApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function SimpleBarChart({ data }) {
    const entries = Object.entries(data || {});
    const max = Math.max(...entries.map(([, v]) => v), 1);

    return (
        <div className="space-y-4">
            {entries.map(([label, value]) => (
                <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-[#0f172a]">{label}</span>
                        <span className="text-[#64748b]">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-[#2563eb] transition-all duration-300"
                            style={{ width: `${(value / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const data = await getAdminAnalytics();
                setAnalytics(data.analytics);
            } catch (error) {
                handleApiError(error, 'Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <DashboardPageSkeleton />;

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Platform Analytics"
                description="High-level metrics and job status distribution."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatsCard
                    title="Total Users"
                    value={analytics?.totalUsers ?? 0}
                    subtitle="Students + recruiters"
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Recruiters"
                    value={analytics?.totalRecruiters ?? 0}
                    subtitle={`${analytics?.activeRecruiters ?? 0} active`}
                    icon={Building2}
                    color="purple"
                />
                <StatsCard
                    title="Students"
                    value={analytics?.totalStudents ?? 0}
                    subtitle={`${analytics?.activeStudents ?? 0} active`}
                    icon={GraduationCap}
                    color="green"
                />
                <StatsCard
                    title="Jobs"
                    value={analytics?.totalJobs ?? 0}
                    subtitle="All statuses"
                    icon={Briefcase}
                    color="amber"
                />
                <StatsCard
                    title="Applications"
                    value={analytics?.totalApplications ?? 0}
                    subtitle="Platform-wide"
                    icon={FileText}
                    color="blue"
                />
            </div>

            <Card>
                <h2 className="mb-6 text-lg font-semibold text-[#0f172a]">
                    Jobs by Status
                </h2>
                {analytics?.jobsByStatus &&
                Object.keys(analytics.jobsByStatus).length > 0 ? (
                    <SimpleBarChart data={analytics.jobsByStatus} />
                ) : (
                    <p className="text-sm text-[#64748b]">No job data available.</p>
                )}
            </Card>
        </div>
    );
}

export default AdminAnalytics;
