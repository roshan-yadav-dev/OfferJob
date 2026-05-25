import StatsCard from '../../components/dashboard/StatsCard';

function StudentDashboard() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}

            <div>
                <h1
                    className="
                        text-4xl
                        font-bold
                        text-gray-800
                    "
                >
                    Welcome Back 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Track jobs, applications, and resume progress.
                </p>
            </div>

            {/* Stats Section */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                "
            >
                <StatsCard title="Applied Jobs" value="12" />

                <StatsCard title="Resume Score" value="85%" />

                <StatsCard title="Interviews" value="3" />
            </div>

            {/* Recent Activity */}

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-md
                    p-6
                "
            >
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

                <p className="text-gray-600">No recent activity yet.</p>
            </div>
        </div>
    );
}

export default StudentDashboard;
