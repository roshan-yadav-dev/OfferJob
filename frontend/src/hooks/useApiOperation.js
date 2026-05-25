import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { handleApiError } from '../utils/apiErrorHandler';

/**
 * Hook for managing API operations with:
 * - Loading state
 * - Error handling
 * - Automatic duplicate prevention
 * - Success/error callbacks
 *
 * Usage:
 * const { execute, loading, error } = useApiOperation(apiFunction, {
 *   onSuccess: (data) => console.log(data),
 *   errorMessage: 'Failed to fetch data'
 * });
 */
export const useApiOperation = (
    apiFunction,
    {
        onSuccess,
        onError,
        errorMessage = 'Operation failed',
        preventDuplicates = true,
    } = {},
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isExecutingRef = useRef(false);

    const execute = useCallback(
        async (...args) => {
            // Prevent duplicate submissions
            if (preventDuplicates && isExecutingRef.current) {
                return;
            }

            try {
                isExecutingRef.current = true;
                setLoading(true);
                setError(null);

                // Call the API function
                const data = await apiFunction(...args);

                // Call success callback if provided
                if (onSuccess) {
                    onSuccess(data);
                }

                return data;
            } catch (err) {
                console.error('API Operation Error:', err);

                // Handle error
                handleApiError(err, errorMessage);

                setError(err);

                // Call error callback if provided
                if (onError) {
                    onError(err);
                }

                throw err;
            } finally {
                setLoading(false);
                isExecutingRef.current = false;
            }
        },
        [apiFunction, onSuccess, onError, errorMessage, preventDuplicates],
    );

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        isExecutingRef.current = false;
    }, []);

    return {
        execute,
        loading,
        error,
        reset,
    };
};

/**
 * Hook for handling multiple API operations with shared loading state
 * Prevents duplicate submissions across multiple operations
 *
 * Usage:
 * const { loading, executeAsync } = useAsyncState();
 * const handleSubmit = () => {
 *   await executeAsync(async () => {
 *     await api1();
 *     await api2();
 *   });
 * };
 */
export const useAsyncState = () => {
    const [loading, setLoading] = useState(false);
    const isExecutingRef = useRef(false);

    const executeAsync = useCallback(async (asyncFunction) => {
        if (isExecutingRef.current) return;

        try {
            isExecutingRef.current = true;
            setLoading(true);
            return await asyncFunction();
        } catch (error) {
            console.error('Async operation error:', error);
            handleApiError(error);
            throw error;
        } finally {
            setLoading(false);
            isExecutingRef.current = false;
        }
    }, []);

    return { loading, executeAsync };
};

export default useApiOperation;
