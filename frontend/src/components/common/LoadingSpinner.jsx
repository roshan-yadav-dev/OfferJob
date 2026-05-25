function LoadingSpinner({ text = 'Loading...' }) {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
                <div className="mb-4 inline-block">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>

                <p className="text-gray-600">{text}</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
