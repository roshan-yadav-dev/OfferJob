import Card from '../../components/common/Card';

export const LoadingSpinner = ({ message = 'Loading...' }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
            <div className="mb-4 inline-block">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
            </div>
            <p className="text-gray-600">{message}</p>
        </div>
    </div>
);

export const EmptyState = ({ message = 'No data available', icon = '📭' }) => (
    <Card>
        <div className="py-8 text-center">
            <p className="text-3xl mb-2">{icon}</p>
            <p className="text-lg text-gray-500">{message}</p>
        </div>
    </Card>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
    <Card>
        <div className="py-8 text-center">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-lg text-gray-500 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            )}
        </div>
    </Card>
);
