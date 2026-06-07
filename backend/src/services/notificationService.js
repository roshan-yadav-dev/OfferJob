const axios = require('axios');
const env = require('../config/env');
const logger = require('../config/logger');

const NOTIFICATION_SERVICE_URL = env.NOTIFICATION_SERVICE_URL;

const sendApplicationStatusNotification = async ({
    to,
    studentName,
    jobTitle,
    status,
}) => {
    try {
        await axios.post(
            `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/application-status`,
            {
                to,
                studentName,
                jobTitle,
                status,
            },
            {
                timeout: 5000,
            },
        );
    } catch (error) {
        logger.error('Failed to send application status notification', {
            to,
            job_title: jobTitle,
            status,
            error_message: error.message,
        });
    }
};

module.exports = {
    sendApplicationStatusNotification,
};
