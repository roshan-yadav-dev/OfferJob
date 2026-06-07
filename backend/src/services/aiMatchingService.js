const axios = require('axios');

const logger = require('../config/logger');
const env = require('../config/env');

const AI_SERVICE_CONFIG = {
    baseURL: env.AI_SERVICE_URL,
    timeout: env.AI_SERVICE_TIMEOUT,
    maxRetries: env.AI_SERVICE_MAX_RETRIES,
    retryDelay: env.AI_SERVICE_RETRY_DELAY,
};

const aiClient = axios.create({
    baseURL: AI_SERVICE_CONFIG.baseURL,
    timeout: AI_SERVICE_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JobServicePlatform/1.0',
    },
});

aiClient.interceptors.request.use((config) => {
    config.metadata = { startTime: Date.now() };

    logger.debug('AI matching HTTP request', {
        method: config.method?.toUpperCase(),
        endpoint: config.url,
        base_url: config.baseURL,
    });

    return config;
});

aiClient.interceptors.response.use(
    (response) => {
        const durationMs = Date.now() - response.config.metadata.startTime;

        logger.debug('AI matching HTTP response', {
            method: response.config.method?.toUpperCase(),
            endpoint: response.config.url,
            status: response.status,
            duration_ms: durationMs,
        });

        return response;
    },
    (error) => {
        const durationMs = error.config?.metadata?.startTime
            ? Date.now() - error.config.metadata.startTime
            : null;

        logger.error('AI matching HTTP failure', {
            method: error.config?.method?.toUpperCase(),
            endpoint: error.config?.url,
            status: error.response?.status ?? null,
            error_code: error.code ?? null,
            duration_ms: durationMs,
            error_message: error.message,
        });

        return Promise.reject(error);
    },
);

function createAiMatchingError(message, originalError) {
    const error = new Error(message);

    error.name = 'AIMatchingServiceError';
    error.statusCode =
        originalError?.response?.status ??
        (originalError?.code === 'ECONNABORTED' ? 504 : 502);
    error.isAiMatchingServiceError = true;
    error.originalError = originalError;

    return error;
}

function validatePayload(payload) {
    const { resumeText, jobDescription, userId, jobId } = payload || {};

    if (typeof resumeText !== 'string' || !resumeText.trim()) {
        throw new Error('resumeText is required');
    }

    if (typeof jobDescription !== 'string' || !jobDescription.trim()) {
        throw new Error('jobDescription is required');
    }

    if (typeof userId !== 'string' || !userId.trim()) {
        throw new Error('userId is required');
    }

    if (typeof jobId !== 'string' || !jobId.trim()) {
        throw new Error('jobId is required');
    }
}

async function matchResumeToJob(payload) {
    validatePayload(payload);

    const { resumeText, jobDescription, userId, jobId } = payload;
    const cleanResumeText = resumeText.trim();
    const cleanJobDescription = jobDescription.trim();
    const cleanUserId = userId.trim();
    const cleanJobId = jobId.trim();

    logger.info('AI matching started', {
        user_id: cleanUserId,
        job_id: cleanJobId,
        resume_text_length: cleanResumeText.length,
        job_description_length: cleanJobDescription.length,
    });

    try {
        const response = await aiClient.post('/match', {
            resumeText: cleanResumeText,
            jobDescription: cleanJobDescription,
            userId: cleanUserId,
            jobId: cleanJobId,
        });

        const similarityScore = response.data?.similarityScore;

        if (
            typeof similarityScore !== 'number' ||
            Number.isNaN(similarityScore) ||
            similarityScore < 0 ||
            similarityScore > 1
        ) {
            throw new Error('Invalid similarityScore returned by AI service');
        }

        logger.info('AI matching completed', {
            user_id: cleanUserId,
            job_id: cleanJobId,
            similarity_score: similarityScore,
        });

        return similarityScore;
    } catch (error) {
        logger.error('AI matching could not be completed', {
            user_id: cleanUserId,
            job_id: cleanJobId,
            error_name: error.name,
            error_message: error.message,
        });

        throw createAiMatchingError(
            'Unable to compute AI similarity score',
            error,
        );
    }
}

async function isServiceHealthy() {
    try {
        const response = await aiClient.get('/health', { timeout: 5000 });

        return response.data?.ready_for_matching === true;
    } catch (error) {
        logger.warn('AI matching health check failed', {
            error_message: error.message,
        });

        return false;
    }
}

async function getServiceInfo() {
    try {
        const response = await aiClient.get('/models', { timeout: 5000 });

        return response.data;
    } catch (error) {
        logger.warn('Failed to load AI matching service info', {
            error_message: error.message,
        });

        return null;
    }
}

module.exports = {
    matchResumeToJob,
    isServiceHealthy,
    getServiceInfo,
    AI_SERVICE_CONFIG,
};
