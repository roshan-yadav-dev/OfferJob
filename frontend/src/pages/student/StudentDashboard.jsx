import { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import { getStudentDashboard } from '../../api/applicationApi';

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

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        Welcome Back 👋
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Track jobs, applications, and resume progress.
                    </p>
                </div>
                <div className="text-center text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Welcome Back 👋
                </h1>
                <p className="text-gray-500 mt-2">
                    Track jobs, applications, and resume progress.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Applications"
                    value={stats.totalApplications}
                />
                <StatsCard title="Applied" value={stats.appliedCount} />
                <StatsCard title="Shortlisted" value={stats.shortlistedCount} />
                <StatsCard title="Rejected" value={stats.rejectedCount} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
                {stats.recentApplications &&
                stats.recentApplications.length > 0 ? (
                    <div className="space-y-4">
                        {stats.recentApplications.map((app) => (
                            <div
                                key={app._id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {app.job?.title || 'Job Title'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {app.job?.company || 'Company Name'}{' '}
                                            •{' '}
                                            {new Date(
                                                app.createdAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            app.status === 'shortlisted'
                                                ? 'bg-green-100 text-green-800'
                                                : app.status === 'rejected'
                                                  ? 'bg-red-100 text-red-800'
                                                  : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        {app.status?.charAt(0).toUpperCase() +
                                            app.status?.slice(1)}
                                    </span>
                                </div>
                                {app.aiScore !== null &&
                                    app.aiScore !== undefined && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                ATS Score:{' '}
                                                <span className="font-semibold text-gray-800">
                                                    {Math.round(
                                                        app.aiScore * 100,
                                                    )}
                                                    %
                                                </span>
                                            </p>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No applications yet.</p>
                )}
            </div>

            {/* Latest ATS Scores */}
            {stats.latestAtsScores && stats.latestAtsScores.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Latest ATS Scores
                    </h2>
                    <div className="space-y-3">
                        {stats.latestAtsScores.map((app) => (
                            <div
                                key={app._id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                                <span className="text-gray-700">
                                    {app.job?.title || 'Job Title'} at{' '}
                                    {app.job?.company || 'Company'}
                                </span>
                                <span className="font-bold text-blue-600">
                                    {Math.round(app.aiScore * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;
