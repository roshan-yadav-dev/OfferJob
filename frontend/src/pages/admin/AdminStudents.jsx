import { useEffect, useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { ApplicationListSkeleton, EmptyState } from '../../components/common/LoadingStates';
import {
    getAdminStudents,
    updateStudentStatus,
} from '../../api/adminApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import { showSuccess } from '../../utils/toast';
import { formatDisplayDate } from '../../utils/formatters';

function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getAdminStudents({ search });
            setStudents(data.students || []);
        } catch (error) {
            handleApiError(error, 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchStudents, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleToggleStatus = async (student) => {
        try {
            setActionLoading(student._id);
            const nextStatus = !student.isActive;
            await updateStudentStatus(student._id, nextStatus);
            showSuccess(
                `Student ${nextStatus ? 'activated' : 'suspended'} successfully`,
            );
            await fetchStudents();
        } catch (error) {
            handleApiError(error, 'Failed to update student status');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && students.length === 0) {
        return <ApplicationListSkeleton count={3} />;
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            <PageHeader
                title="Student Management"
                description="View and manage student accounts on the platform."
            />

            <Card>
                <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                    Search students
                </label>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Name, email, college..."
                        className="focus-ring w-full rounded-xl border border-[#e2e8f0] py-2.5 pl-10 pr-4 text-sm"
                    />
                </div>
            </Card>

            {students.length === 0 ? (
                <EmptyState
                    title="No students found"
                    message="Try a different search term."
                    icon={GraduationCap}
                />
            ) : (
                <Card padding={false}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-[#e2e8f0] bg-slate-50 text-left text-[#64748b]">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">College</th>
                                    <th className="px-4 py-3 font-medium">Joined</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr
                                        key={student._id}
                                        className="border-b border-[#e2e8f0] last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium text-[#0f172a]">
                                            {student.name}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {student.email}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {student.collegeName || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {formatDisplayDate(student.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                status={
                                                    student.isActive
                                                        ? 'active'
                                                        : 'inactive'
                                                }
                                                label={
                                                    student.isActive
                                                        ? 'Active'
                                                        : 'Suspended'
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                size="sm"
                                                variant={
                                                    student.isActive
                                                        ? 'danger'
                                                        : 'primary'
                                                }
                                                loading={
                                                    actionLoading === student._id
                                                }
                                                onClick={() =>
                                                    handleToggleStatus(student)
                                                }
                                            >
                                                {student.isActive
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

export default AdminStudents;
