const axios = require('axios');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;

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
        );
    } catch (error) {
        console.error('Notification service error:', error.message);
    }
};

module.exports = {
    sendApplicationStatusNotification,
};
