/**
 * Simple Logger for Backend Services
 *
 * Provides structured logging with levels: debug, info, warn, error
 * Uses console output (compatible with Docker logging)
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

const LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];

/**
 * Format timestamp as ISO string
 */
function getTimestamp() {
    return new Date().toISOString();
}

/**
 * Log message with level and context
 */
function log(level, levelName, message, context = {}) {
    if (LOG_LEVELS[levelName] < LOG_LEVEL) {
        return; // Skip if below configured level
    }

    const logEntry = {
        timestamp: getTimestamp(),
        level: levelName,
        message,
        ...context,
    };

    // Use appropriate console method
    const consoleMethod = {
        DEBUG: 'log',
        INFO: 'log',
        WARN: 'warn',
        ERROR: 'error',
    }[levelName];

    console[consoleMethod](JSON.stringify(logEntry));
}

module.exports = {
    debug: (message, context) =>
        log(LOG_LEVELS.DEBUG, 'DEBUG', message, context),
    info: (message, context) => log(LOG_LEVELS.INFO, 'INFO', message, context),
    warn: (message, context) => log(LOG_LEVELS.WARN, 'WARN', message, context),
    error: (message, context) =>
        log(LOG_LEVELS.ERROR, 'ERROR', message, context),
};
