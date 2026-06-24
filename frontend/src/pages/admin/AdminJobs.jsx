import { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { JobListSkeleton, EmptyState } from '../../components/common/LoadingStates';
import {
    getAdminJobs,
    getAdminJobById,
    updateAdminJobStatus,
} from '../../api/adminApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import { showSuccess } from '../../utils/toast';
import { formatDisplayDate } from '../../utils/formatters';

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'DELETED', label: 'Deleted' },
];

function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getAdminJobs({
                search,
                status: statusFilter,
            });
            setJobs(data.jobs || []);
        } catch (error) {
            handleApiError(error, 'Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchJobs, 300);
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const handleViewDetails = async (jobId) => {
        try {
            const data = await getAdminJobById(jobId);
            setSelectedJob(data.job);
            setDetailOpen(true);
        } catch (error) {
            handleApiError(error, 'Failed to load job details');
        }
    };

    const handleStatusChange = async (jobId, status) => {
        try {
            setActionLoading(`${jobId}-${status}`);
            await updateAdminJobStatus(jobId, status);
            showSuccess(`Job marked as ${status.toLowerCase()}`);
            await fetchJobs();
            if (selectedJob?._id === jobId) {
                const data = await getAdminJobById(jobId);
                setSelectedJob(data.job);
            }
        } catch (error) {
            handleApiError(error, 'Failed to update job status');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && jobs.length === 0) return <JobListSkeleton count={3} />;

    return (
        <div className="animate-fade-in-up space-y-6">
            <PageHeader
                title="Job Management"
                description="Search, filter, and manage all platform job postings."
            />

            <Card>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                            Search jobs
                        </label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Title, company, location..."
                                className="focus-ring w-full rounded-xl border border-[#e2e8f0] py-2.5 pl-10 pr-4 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="focus-ring w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {jobs.length === 0 ? (
                <EmptyState
                    title="No jobs found"
                    message="Try adjusting your search or status filter."
                    icon={Search}
                />
            ) : (
                <Card padding={false}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-[#e2e8f0] bg-slate-50 text-left text-[#64748b]">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Job</th>
                                    <th className="px-4 py-3 font-medium">Company</th>
                                    <th className="px-4 py-3 font-medium">Recruiter</th>
                                    <th className="px-4 py-3 font-medium">Posted</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr
                                        key={job._id}
                                        className="border-b border-[#e2e8f0] last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium text-[#0f172a]">
                                            {job.title}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {job.company}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {job.postedBy?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748b]">
                                            {formatDisplayDate(job.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge status={job.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleViewDetails(job._id)
                                                    }
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Button>
                                                {job.status !== 'CLOSED' &&
                                                    job.status !== 'DELETED' && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            loading={
                                                                actionLoading ===
                                                                `${job._id}-CLOSED`
                                                            }
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    job._id,
                                                                    'CLOSED',
                                                                )
                                                            }
                                                        >
                                                            Close
                                                        </Button>
                                                    )}
                                                {job.status !== 'DELETED' && (
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        loading={
                                                            actionLoading ===
                                                            `${job._id}-DELETED`
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                job._id,
                                                                'DELETED',
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                                {job.status !== 'ACTIVE' && (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        loading={
                                                            actionLoading ===
                                                            `${job._id}-ACTIVE`
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                job._id,
                                                                'ACTIVE',
                                                            )
                                                        }
                                                    >
                                                        Restore
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Modal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                title="Job Details"
                size="lg"
            >
                {selectedJob && (
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-[#0f172a]">
                                {selectedJob.title}
                            </h3>
                            <Badge status={selectedJob.status} />
                        </div>
                        <p className="text-[#64748b]">
                            {selectedJob.company} · {selectedJob.location}
                        </p>
                        <p className="text-[#64748b]">
                            Salary: {selectedJob.salary}
                        </p>
                        <p className="leading-relaxed text-[#64748b]">
                            {selectedJob.description}
                        </p>
                        {selectedJob.skillsRequired?.length > 0 && (
                            <p className="text-[#64748b]">
                                Skills: {selectedJob.skillsRequired.join(', ')}
                            </p>
                        )}
                        <p className="text-[#64748b]">
                            Recruiter: {selectedJob.postedBy?.name} (
                            {selectedJob.postedBy?.email})
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default AdminJobs;
