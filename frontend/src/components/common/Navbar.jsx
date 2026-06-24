import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        navigate('/login');
    };

    return (
        <nav
            className="
                sticky
                top-0
                z-50
                flex
                items-center
                justify-between
                border-b
                border-[#e2e8f0]
                bg-white/95
                px-4
                py-4
                backdrop-blur-sm
                sm:px-8
            "
        >
            <Link
                to="/"
                className="text-xl font-bold tracking-tight text-[#2563eb] sm:text-2xl"
            >
                Smart AI Job Portal
            </Link>

            <div className="flex items-center gap-4 text-sm font-medium sm:gap-6">
                <Link
                    to="/"
                    className="hidden text-[#64748b] transition-colors hover:text-[#0f172a] sm:inline"
                >
                    Home
                </Link>

                <Link
                    to="/jobs"
                    className="text-[#64748b] transition-colors hover:text-[#0f172a]"
                >
                    Jobs
                </Link>

                {!user && (
                    <>
                        <Link
                            to="/login"
                            className="text-[#64748b] transition-colors hover:text-[#0f172a]"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="rounded-xl bg-[#2563eb] px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                            Signup
                        </Link>
                    </>
                )}

                {user && user.role === 'admin' && (
                    <Link
                        to="/admin/dashboard"
                        className="hidden text-[#64748b] transition-colors hover:text-[#0f172a] sm:inline"
                    >
                        Admin
                    </Link>
                )}

                {user && user.role === 'student' && (
                    <Link
                        to="/student/dashboard"
                        className="hidden text-[#64748b] transition-colors hover:text-[#0f172a] sm:inline"
                    >
                        Dashboard
                    </Link>
                )}

                {user && user.role === 'recruiter' && (
                    <Link
                        to="/recruiter/dashboard"
                        className="hidden text-[#64748b] transition-colors hover:text-[#0f172a] sm:inline"
                    >
                        Dashboard
                    </Link>
                )}

                {user && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="focus-ring rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm font-medium text-[#64748b] transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
