import { useEffect, useState } from 'react';

import Card from '../../components/common/Card';
import {
    LoadingSpinner,
    EmptyState,
} from '../../components/common/LoadingStates';

import { getMyApplications } from '../../api/applicationApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function StudentApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const data = await getMyApplications();

            setApplications(data.applications || []);
        } catch (error) {
            console.error(error);

            handleApiError(error, 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchApplications();
        })();
    }, []);

    const getStatusColor = (status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-700',

            shortlisted: 'bg-green-100 text-green-700',

            rejected: 'bg-red-100 text-red-700',

            accepted: 'bg-blue-100 text-blue-700',

            applied: 'bg-yellow-100 text-yellow-700',
        };

        return (
            statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'
        );
    };

    if (loading) {
        return <LoadingSpinner message="Loading applications..." />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800">
                    My Applications 📄
                </h1>

                <p className="mt-2 text-gray-500">
                    Track all your job applications.
                    {applications.length > 0 &&
                        ` You have ${applications.length} application(s).`}
                </p>
            </div>

            {applications.length === 0 ? (
                <EmptyState
                    message="You haven't applied to any jobs yet. Start applying now!"
                    icon="📭"
                />
            ) : (
                <Card>
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div
                                key={application._id || application.id}
                                className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        pb-4
                                        last:border-b-0
                                    "
                            >
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {application.job?.title || 'Job Title'}
                                    </h2>

                                    <p className="text-gray-500">
                                        Applied on{' '}
                                        {new Date(
                                            application.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <span
                                    className={`
                                            ${getStatusColor(
                                                application.status,
                                            )}
                                            rounded-full
                                            px-3
                                            py-1
                                            text-sm
                                            font-medium
                                        `}
                                >
                                    {application.status || 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default StudentApplications;
