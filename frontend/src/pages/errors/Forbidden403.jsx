import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

function Forbidden403() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getDashboardPath = () => {
        if (!user) return '/';
        return user.role === 'recruiter'
            ? '/recruiter/dashboard'
            : '/student/dashboard';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-gray-100">
            <div className="text-center px-6 py-12 max-w-md">
                {/* Error Code */}
                <h1 className="text-9xl font-bold text-red-600 mb-4">403</h1>

                {/* Error Title */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Access Forbidden
                </h2>

                {/* Error Description */}
                <p className="text-gray-600 text-lg mb-8">
                    You don't have permission to access this resource. Contact
                    support if you believe this is a mistake.
                </p>

                {/* Illustration */}
                <div className="text-6xl mb-8">⛔</div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={() => navigate(getDashboardPath())}
                        className="w-full"
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="w-full"
                    >
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Forbidden403;
