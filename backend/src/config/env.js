require('dotenv').config();

// Determine environment and load appropriate config
const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development' || nodeEnv === 'local';

const APP_NAME = 'Job Service Platform';

// Default URLs based on environment
const defaultServiceUrls = isDevelopment
    ? {
          AI_SERVICE_URL: 'http://localhost:8000/api/v1/ai',
          CORS_ORIGIN: 'http://localhost:3000',
          FRONTEND_URL: 'http://localhost:3000',
          API_BASE_URL: 'http://localhost:5000',
      }
    : {
          AI_SERVICE_URL: 'http://ai-service:8000/api/v1/ai',
          CORS_ORIGIN: 'http://frontend:3000',
          FRONTEND_URL: 'http://frontend:3000',
          API_BASE_URL: 'http://backend:5000',
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

const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    defaultServiceUrls.FRONTEND_URL;

const port = process.env.PORT || 5000;

module.exports = {
    NODE_ENV: nodeEnv,
    IS_DEVELOPMENT: isDevelopment,
    PORT: port,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN || defaultServiceUrls.CORS_ORIGIN,
    FRONTEND_URL: frontendUrl,
    API_BASE_URL:
        process.env.API_BASE_URL ||
        defaultServiceUrls.API_BASE_URL ||
        `http://localhost:${port}`,
    APP_NAME,
    EMAIL_SENDER_NAME: APP_NAME,

    // Email (SMTP)
    MAIL_HOST: process.env.MAIL_HOST || 'smtp-relay.brevo.com',
    MAIL_PORT: parseInt(process.env.MAIL_PORT || '587', 10),
    MAIL_USERNAME: process.env.MAIL_USERNAME || '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
    MAIL_FROM: process.env.MAIL_FROM || '',

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
