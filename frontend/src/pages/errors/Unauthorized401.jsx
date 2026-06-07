import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

function Unauthorized401() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-50 to-gray-100">
            <div className="text-center px-6 py-12 max-w-md">
                {/* Error Code */}
                <h1 className="text-9xl font-bold text-yellow-600 mb-4">401</h1>

                {/* Error Title */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Unauthorized
                </h2>

                {/* Error Description */}
                <p className="text-gray-600 text-lg mb-8">
                    You need to log in to access this page. Please sign in with
                    your credentials.
                </p>

                {/* Illustration */}
                <div className="text-6xl mb-8">🔐</div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/login')}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/signup')}
                        className="w-full"
                    >
                        Create Account
                    </Button>
                </div>

                {/* Home Link */}
                <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-6"
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

export default Unauthorized401;
