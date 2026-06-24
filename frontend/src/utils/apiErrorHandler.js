import { showError } from './toast';

/**
 * Extracts error message from various error formats
 * Handles: backend error responses, field-specific errors, and generic errors
 */
export const extractErrorMessage = (
    error,
    defaultMessage = 'An error occurred',
) => {
    // Nested response data message
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Field-specific validation errors (object format from backend)
    if (error.response?.data?.errors) {
        if (typeof error.response.data.errors === 'object') {
            // Handle both array and object formats
            if (Array.isArray(error.response.data.errors)) {
                const firstError = error.response.data.errors[0];
                return typeof firstError === 'string'
                    ? firstError
                    : firstError?.msg || defaultMessage;
            } else {
                // Object format: { field: "message" }
                const firstError = Object.values(error.response.data.errors)[0];
                return typeof firstError === 'string'
                    ? firstError
                    : defaultMessage;
            }
        }
    }

    // Direct error message in response
    if (error.message) {
        return error.message;
    }

    return defaultMessage;
};

/**
 * Handles API errors and shows appropriate toast notifications
 * Supports field-specific errors and general error messages
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
    // Field-specific validation errors (object format)
    if (
        error.response?.data?.errors &&
        typeof error.response.data.errors === 'object' &&
        !Array.isArray(error.response.data.errors)
    ) {
        Object.values(error.response.data.errors).forEach((err) => {
            if (typeof err === 'string') {
                showError(err);
            }
        });
        return;
    }

    // Field-specific validation errors (array format from express-validator)
    if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
    ) {
        error.response.data.errors.forEach((err) => {
            const message = typeof err === 'string' ? err : err?.msg;
            if (message) {
                showError(message);
            }
        });
        return;
    }

    // Single message error
    const message = extractErrorMessage(error, defaultMessage);
    showError(message);
};

/**
 * Safe API call wrapper with automatic error handling
 * Usage: const data = await safeApiCall(() => apiFunction(), 'Error message')
 */
export const safeApiCall = async (
    apiFunction,
    errorMessage = 'An error occurred',
) => {
    try {
        return await apiFunction();
    } catch (error) {
        console.error('API Error:', error);
        handleApiError(error, errorMessage);
        throw error;
    }
};

/**
 * Returns appropriate HTTP status text for UI display
 */
export const getHttpErrorStatus = (statusCode) => {
    const statusTexts = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Validation Error',
        500: 'Server Error',
        503: 'Service Unavailable',
    };
    return statusTexts[statusCode] || 'Error';
};

/**
 * Checks if error is authentication-related
 */
export const isAuthError = (error) => {
    return error.response?.status === 401 || error.response?.status === 403;
};

/**
 * Checks if error is validation-related
 */
export const isValidationError = (error) => {
    return error.response?.status === 400 || error.response?.status === 422;
};
