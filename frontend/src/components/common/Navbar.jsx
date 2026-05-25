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
                flex
                items-center
                justify-between
                px-8
                py-4
                bg-white
                shadow-sm
            "
        >
            <h1 className="text-2xl font-bold text-blue-600">
                Smart AI Job Portal
            </h1>

            <div className="flex gap-6 font-medium items-center">
                <Link to="/">Home</Link>

                <Link to="/jobs">Jobs</Link>

                {!user && (
                    <>
                        <Link to="/login">Login</Link>

                        <Link to="/signup">Signup</Link>
                    </>
                )}

                {user && user.role === 'student' && (
                    <Link to="/student/dashboard">Dashboard</Link>
                )}

                {user && user.role === 'recruiter' && (
                    <Link to="/recruiter/dashboard">Dashboard</Link>
                )}

                {user && (
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
                        "
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
