function EmptyState({ message = 'No data found' }) {
    return (
        <div className="py-8 text-center">
            <p className="text-lg text-gray-500">{message}</p>
        </div>
    );
}

export default EmptyState;
