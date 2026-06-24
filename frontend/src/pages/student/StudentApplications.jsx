import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import ApplicationCard from '../../components/jobs/ApplicationCard';
import {
    ApplicationListSkeleton,
    EmptyState,
} from '../../components/common/LoadingStates';

import { getMyApplications } from '../../api/applicationApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function StudentApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getMyApplications();

            setApplications(data.applications || []);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || 'Failed to load applications';
            setError(errorMsg);
            handleApiError(err, errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    if (loading) {
        return <ApplicationListSkeleton />;
    }

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader title="My Applications" />
                <div
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                    role="alert"
                >
                    <p className="font-semibold">Error Loading Applications</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <PageHeader
                title="My Applications"
                description={
                    applications.length > 0
                        ? `Track all your job applications. You have ${applications.length} application(s).`
                        : 'Track all your job applications.'
                }
            />

            {applications.length === 0 ? (
                <EmptyState
                    title="No applications yet"
                    message="You haven't applied to any jobs yet. Browse open roles and submit your first application."
                    icon={FileText}
                    actionLabel="Browse Jobs"
                    actionTo="/student/jobs"
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {applications.map((application) => (
                        <ApplicationCard
                            key={application._id || application.id}
                            application={application}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentApplications;
