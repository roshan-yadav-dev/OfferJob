require('dotenv').config();

// Determine environment and load appropriate config
const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development' || nodeEnv === 'local';

// Default URLs based on environment
const defaultServiceUrls = isDevelopment
    ? {
          AI_SERVICE_URL: 'http://localhost:8000/api/v1/ai',
          NOTIFICATION_SERVICE_URL: 'http://localhost:8082',
          CORS_ORIGIN: 'http://localhost:3000',
      }
    : {
          AI_SERVICE_URL: 'http://ai-service:8000/api/v1/ai',
          NOTIFICATION_SERVICE_URL: 'http://notification-service:8082',
          CORS_ORIGIN: 'http://frontend:3000',
      };

// Validate required environment variables
if (!process.env.MONGO_URI) {
    console.warn('Warning: MONGO_URI environment variable not set');
}
if (!process.env.JWT_SECRET) {
    console.warn(
        'Warning: JWT_SECRET environment variable not set. Generate a secure secret for production.',
    );
}

module.exports = {
    NODE_ENV: nodeEnv,
    IS_DEVELOPMENT: isDevelopment,
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN || defaultServiceUrls.CORS_ORIGIN,
    NOTIFICATION_SERVICE_URL:
        process.env.NOTIFICATION_SERVICE_URL ||
        defaultServiceUrls.NOTIFICATION_SERVICE_URL,

    // AI Matching Service
    AI_SERVICE_URL:
        process.env.AI_SERVICE_URL || defaultServiceUrls.AI_SERVICE_URL,
    AI_SERVICE_TIMEOUT: parseInt(process.env.AI_SERVICE_TIMEOUT || '30000', 10),
    AI_SERVICE_MAX_RETRIES: parseInt(
        process.env.AI_SERVICE_MAX_RETRIES || '2',
        10,
    ),
    AI_SERVICE_RETRY_DELAY: parseInt(
        process.env.AI_SERVICE_RETRY_DELAY || '1000',
        10,
    ),

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
};
