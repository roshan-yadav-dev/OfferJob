import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

function NotFound404() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="text-center px-6 py-12 max-w-md">
                {/* Error Code */}
                <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>

                {/* Error Title */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h2>

                {/* Error Description */}
                <p className="text-gray-600 text-lg mb-8">
                    Sorry, the page you're looking for doesn't exist. It might
                    have been moved or deleted.
                </p>

                {/* Illustration */}
                <div className="text-6xl mb-8">🔍</div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/')}
                        className="w-full"
                    >
                        Go to Home
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="w-full"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NotFound404;
