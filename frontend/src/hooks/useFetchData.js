import { useState, useEffect, useCallback } from 'react';
import { handleApiError } from '../utils/apiErrorHandler';

/**
 * Hook for fetching data with automatic loading, error, and refetch handling
 *
 * Usage:
 * const { data, loading, error, refetch } = useFetchData(apiFunction, [dependency]);
 * const { data, loading, error, refetch } = useFetchData(() => getJobs(filter), [filter]);
 */
export const useFetchData = (fetchFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const executeQuery = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err);
            handleApiError(err, 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]);

    useEffect(() => {
        executeQuery();
    }, dependencies);

    const refetch = useCallback(() => {
        executeQuery();
    }, [executeQuery]);

    return { data, loading, error, refetch };
};

/**
 * Hook for paginated data fetching
 *
 * Usage:
 * const { data, page, setPage, loading, hasMore } = usePaginatedData(
 *   (page) => getJobs({ page }),
 *   [filter]
 * );
 */
export const usePaginatedData = (
    fetchFunction,
    dependencies = [],
    pageSize = 10,
) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await fetchFunction(page);
                const newData = result.data || result;

                if (page === 1) {
                    setData(newData);
                } else {
                    setData((prev) => [...prev, ...newData]);
                }

                setHasMore(newData.length === pageSize);
            } catch (err) {
                console.error('Pagination error:', err);
                setError(err);
                handleApiError(err, 'Failed to load more data');
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [page, ...dependencies]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    }, [loading, hasMore]);

    const reset = useCallback(() => {
        setPage(1);
        setData([]);
    }, []);

    return { data, page, setPage, loading, hasMore, error, loadMore, reset };
};

/**
 * Hook for debounced search with API calls
 *
 * Usage:
 * const { results, loading, searchValue, setSearchValue } = useSearchData(
 *   (query) => searchJobs(query),
 *   300
 * );
 */
export const useSearchData = (searchFunction, debounceDelay = 300) => {
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchValue.trim().length === 0) {
                setResults([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await searchFunction(searchValue);
                setResults(data.results || data || []);
            } catch (err) {
                console.error('Search error:', err);
                setError(err);
                handleApiError(err, 'Search failed');
            } finally {
                setLoading(false);
            }
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [searchValue, searchFunction, debounceDelay]);

    const clearSearch = useCallback(() => {
        setSearchValue('');
        setResults([]);
    }, []);

    return {
        searchValue,
        setSearchValue,
        results,
        loading,
        error,
        clearSearch,
    };
};

export default useFetchData;
