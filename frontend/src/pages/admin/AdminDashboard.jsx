import { useEffect, useState } from 'react';
import {
    GraduationCap,
    Building2,
    Briefcase,
    FileText,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import { DashboardPageSkeleton } from '../../components/common/LoadingStates';
import { getAdminDashboard } from '../../api/adminApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getAdminDashboard();
                setStats(data.stats);
            } catch (error) {
                handleApiError(error, 'Failed to load admin dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <DashboardPageSkeleton />;

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="Admin Dashboard"
                description="Platform overview and key metrics."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Students"
                    value={stats?.totalStudents ?? 0}
                    subtitle="Registered students"
                    icon={GraduationCap}
                    color="blue"
                />
                <StatsCard
                    title="Total Recruiters"
                    value={stats?.totalRecruiters ?? 0}
                    subtitle="Registered recruiters"
                    icon={Building2}
                    color="purple"
                />
                <StatsCard
                    title="Total Jobs"
                    value={stats?.totalJobs ?? 0}
                    subtitle="Non-deleted job posts"
                    icon={Briefcase}
                    color="green"
                />
                <StatsCard
                    title="Total Applications"
                    value={stats?.totalApplications ?? 0}
                    subtitle="All applications processed"
                    icon={FileText}
                    color="amber"
                />
            </div>
        </div>
    );
}

export default AdminDashboard;
