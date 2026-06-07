import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

function ServerError500() {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-gray-100">
            <div className="text-center px-6 py-12 max-w-md">
                {/* Error Code */}
                <h1 className="text-9xl font-bold text-red-600 mb-4">500</h1>

                {/* Error Title */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Server Error
                </h2>

                {/* Error Description */}
                <p className="text-gray-600 text-lg mb-8">
                    Something went wrong on our end. Our team has been notified
                    and is working on a fix.
                </p>

                {/* Illustration */}
                <div className="text-6xl mb-8">⚠️</div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={handleRefresh}
                        className="w-full"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                        className="w-full"
                    >
                        Go to Home
                    </Button>
                </div>

                {/* Support Info */}
                <p className="text-gray-500 text-sm mt-8">
                    If the problem persists, please contact{' '}
                    <a
                        href="mailto:support@jobportal.com"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        support@jobportal.com
                    </a>
                </p>
            </div>
        </div>
    );
}

export default ServerError500;
