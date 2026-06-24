import { useEffect, useState } from 'react';
import { Search, Building2 } from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { ApplicationListSkeleton, EmptyState } from '../../components/common/LoadingStates';
import {
    getAdminRecruiters,
    updateRecruiterStatus,
} from '../../api/adminApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import { showSuccess } from '../../utils/toast';
import { formatDisplayDate } from '../../utils/formatters';

function AdminRecruiters() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRecruiters = async () => {
        try {
            setLoading(true);
            const data = await getAdminRecruiters({ search });
            setRecruiters(data.recruiters || []);
        } catch (error) {
            handleApiError(error, 'Failed to load recruiters');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchRecruiters, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleToggleStatus = async (recruiter) => {
        try {
            setActionLoading(recruiter._id);
            const nextStatus = !recruiter.isActive;
            await updateRecruiterStatus(recruiter._id, nextStatus);
            showSuccess(
                `Recruiter ${nextStatus ? 'activated' : 'suspended'} successfully`,
            );
            await fetchRecruiters();
        } catch (error) {
            handleApiError(error, 'Failed to update recruiter status');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && recruiters.length === 0) {
        return <ApplicationListSkeleton count={3} />;
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            <PageHeader
                title="Recruiter Management"
                description="View and manage recruiter accounts on the platform."
            />

            <Card>
                <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                    Search recruiters
                </label>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Name, email, company..."
                        className="focus-ring w-full rounded-xl border border-[#e2e8f0] py-2.5 pl-10 pr-4 text-sm"
                    />
                </div>
            </Card>

            {recruiters.length === 0 ? (
                <EmptyState
                    title="No recruiters found"
                    message="Try a different search term."
                    icon={Building2}
                />
            ) : (
                <Card padding={false}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-[#e2e8f0] bg-slate-50 text-left text-[#64748b]">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Company</th>
                                    <th className="px-4 py-3 font-medium">Joined</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recruiters.map((recruiter) => (
                                    <tr
                                        key={recruiter._id}
                                        className="border-b border-[#e2e8f0] last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium text-[#0f172a]">
                                            {recruiter.name}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {recruiter.email}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {recruiter.companyName || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {formatDisplayDate(recruiter.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                status={
                                                    recruiter.isActive
                                                        ? 'active'
                                                        : 'inactive'
                                                }
                                                label={
                                                    recruiter.isActive
                                                        ? 'Active'
                                                        : 'Suspended'
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                size="sm"
                                                variant={
                                                    recruiter.isActive
                                                        ? 'danger'
                                                        : 'primary'
                                                }
                                                loading={
                                                    actionLoading === recruiter._id
                                                }
                                                onClick={() =>
                                                    handleToggleStatus(recruiter)
                                                }
                                            >
                                                {recruiter.isActive
                                                    ? 'Suspend'
                                                    : 'Activate'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}

export default AdminRecruiters;
