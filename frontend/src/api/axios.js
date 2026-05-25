import axios from 'axios';
import toast from 'react-hot-toast';
import { getToken, removeToken } from '../services/tokenService';
import { extractErrorMessage } from '../utils/apiErrorHandler';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 30000, // 30 second timeout
});

// Flag to prevent infinite redirect loops
let isRedirecting = false;

/**
 * Request Interceptor
 * - Attaches JWT token to all requests
 * - Adds request tracking for debugging
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for tracking
        config.metadata = { startTime: new Date() };

        return config;
    },
    (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * - Handles global errors (401, 403, 500, etc.)
 * - Prevents infinite redirect loops
 * - Extracts error messages for consistency
 * - Logs response times for debugging
 */
axiosInstance.interceptors.response.use(
    (response) => {
        // Log response time in development
        if (
            process.env.NODE_ENV === 'development' &&
            response.config.metadata
        ) {
            const duration = new Date() - response.config.metadata.startTime;
            console.log(
                `[API] ${response.config.method.toUpperCase()} ${response.config.url} (${duration}ms)`,
            );
        }
        return response;
    },
    (error) => {
        // Extract backend message safely
        const message = extractErrorMessage(error, 'Something went wrong');

        // Global 401/403 handling - Session expired or unauthorized
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Prevent infinite redirect loop
            if (!isRedirecting) {
                isRedirecting = true;

                // Clear auth data
                removeToken();
                localStorage.removeItem('user');

                // Show toast and redirect
                toast.error(
                    error.response?.status === 401
                        ? 'Session expired. Please login again.'
                        : 'You are not authorized to access this resource.',
                );

                // Redirect after a brief delay to ensure cleanup
                setTimeout(() => {
                    window.location.href = '/login';
                    isRedirecting = false;
                }, 500);
            }
        }

        // Global 500+ error handling
        if (error.response?.status >= 500) {
            console.error('[API] Server error:', error.response.data);
        }

        // Preserve error with extracted message for components to handle
        return Promise.reject({
            ...error,
            message,
        });
    },
);

export default axiosInstance;
