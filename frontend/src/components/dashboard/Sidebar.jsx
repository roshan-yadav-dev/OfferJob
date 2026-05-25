import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div
            className="
                w-64
                min-h-screen
                bg-white
                shadow-md
                p-6
                flex
                flex-col
            "
        >
            <h2
                className="
                    text-2xl
                    font-bold
                    text-blue-600
                    mb-10
                "
            >
                Smart Portal
            </h2>

            <div className="flex flex-col gap-5 flex-1">
                {/* Student Sidebar */}

                {user?.role === 'student' && (
                    <>
                        <Link
                            to="/student/dashboard"
                            className="hover:text-blue-600"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/student/jobs"
                            className="hover:text-blue-600"
                        >
                            Jobs
                        </Link>

                        <Link
                            to="/student/applications"
                            className="hover:text-blue-600"
                        >
                            Applications
                        </Link>

                        <Link
                            to="/student/resume"
                            className="hover:text-blue-600"
                        >
                            Resume
                        </Link>

                        <Link
                            to="/student/profile"
                            className="hover:text-blue-600"
                        >
                            Profile
                        </Link>
                    </>
                )}

                {/* Recruiter Sidebar */}

                {user?.role === 'recruiter' && (
                    <>
                        <Link
                            to="/recruiter/dashboard"
                            className="hover:text-blue-600"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/recruiter/post-job"
                            className="hover:text-blue-600"
                        >
                            Post Job
                        </Link>

                        <Link
                            to="/recruiter/candidates"
                            className="hover:text-blue-600"
                        >
                            Candidates
                        </Link>

                        <Link
                            to="/recruiter/applications"
                            className="hover:text-blue-600"
                        >
                            Applications
                        </Link>

                        <Link
                            to="/recruiter/profile"
                            className="hover:text-blue-600"
                        >
                            Company Profile
                        </Link>
                    </>
                )}
            </div>

            <button
                onClick={handleLogout}
                className="
                    bg-red-500
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-red-600
                    transition
                    w-full
                    font-medium
                    mt-auto
                "
            >
                Logout
            </button>
        </div>
    );
}

export default Sidebar;
