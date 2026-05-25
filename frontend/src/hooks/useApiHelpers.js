/**
 * Custom hook for handling async operations with loading state
 * Prevents duplicate submissions and manages loading state
 */
export const useAsyncOperation = (asyncFunction) => {
    const [loading, setLoading] = React.useState(false);

    const execute = React.useCallback(
        async (...args) => {
            if (loading) return; // Prevent duplicate submissions

            setLoading(true);
            try {
                const result = await asyncFunction(...args);
                return result;
            } finally {
                setLoading(false);
            }
        },
        [asyncFunction, loading],
    );

    return { execute, loading };
};

/**
 * Custom hook for data fetching with error handling
 * Automatically handles loading, error states, and empty data
 */
export const useFetchData = (fetchFunction, dependencies = []) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const refetch = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result.data || result || []);
        } catch (err) {
            setError(err);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]);

    React.useEffect(() => {
        refetch();
    }, dependencies);

    return { data, loading, error, refetch };
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Safely get nested object property
 */
export const getNestedProperty = (obj, path, defaultValue = 'N/A') => {
    const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
    return value ?? defaultValue;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};
