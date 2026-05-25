/**
 * Standardized API Response Utility
 * Ensures all API responses follow consistent format:
 * {
 *   success: boolean,
 *   message: string (optional),
 *   data: any (optional)
 * }
 */

class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

/**
 * Success response helper
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Response data
 * @param {string} message - Response message
 * @returns {Object} Standardized response object
 */
const successResponse = (statusCode = 200, data, message = 'Success') => {
    return new ApiResponse(statusCode, data, message);
};

/**
 * Error response helper
 * @param {number} statusCode - HTTP status code
 * @param {string|Object} message - Error message or validation errors object
 * @returns {Object} Standardized error response object
 */
const errorResponse = (statusCode = 500, message = 'Internal Server Error') => {
    return new ApiResponse(statusCode, null, message);
};

/**
 * Validation error response helper
 * @param {Object} errors - Field-specific validation errors (e.g. {email: "Invalid email"})
 * @returns {Object} Standardized validation error response
 */
const validationErrorResponse = (errors) => {
    return {
        success: false,
        message: 'Validation failed',
        errors: errors, // Object format: { field: "error message" }
    };
};

module.exports = {
    ApiResponse,
    successResponse,
    errorResponse,
    validationErrorResponse,
};
