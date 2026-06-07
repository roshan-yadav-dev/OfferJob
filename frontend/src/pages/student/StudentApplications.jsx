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
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getMyApplications();

            setApplications(data.applications || []);
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || 'Failed to load applications';
            setError(errorMsg);
            handleApiError(error, errorMsg);
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

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        My Applications 📄
                    </h1>
                </div>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error Loading Applications</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
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
                <div className="grid gap-6">
                    {applications.map((application) => (
                        <Card key={application._id || application.id}>
                            <div className="space-y-4">
                                {/* Header with Status */}
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {application.job?.title ||
                                                'Job Title'}
                                        </h2>

                                        <p className="text-gray-600 mt-1">
                                            {application.job?.company ||
                                                'Company Name'}
                                        </p>
                                    </div>

                                    <span
                                        className={`
                                            ${getStatusColor(
                                                application.status,
                                            )}
                                            rounded-lg
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            whitespace-nowrap
                                        `}
                                    >
                                        {application.status || 'Applied'}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">
                                            Applied Date
                                        </p>
                                        <p className="text-gray-900 font-semibold mt-1">
                                            {new Date(
                                                application.createdAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {application.aiScore != null && (
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium">
                                                AI Match Score
                                            </p>
                                            <p
                                                className={`
                                                    font-semibold
                                                    mt-1
                                                    ${
                                                        application.aiScore >=
                                                        0.75
                                                            ? 'text-green-600'
                                                            : application.aiScore >=
                                                                0.5
                                                              ? 'text-yellow-600'
                                                              : 'text-red-600'
                                                    }
                                                `}
                                            >
                                                {(
                                                    application.aiScore * 100
                                                ).toFixed(2)}
                                                %
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">
                                            Job Location
                                        </p>
                                        <p className="text-gray-900 font-semibold mt-1">
                                            {application.job?.location || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentApplications;
