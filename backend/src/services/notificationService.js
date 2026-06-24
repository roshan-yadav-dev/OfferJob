const {
    sendApplicationStatusEmail,
    dispatchEmail,
} = require('./emailService');

const sendApplicationStatusNotification = async ({
    to,
    studentName,
    jobTitle,
    status,
    userId,
}) => {
    dispatchEmail(() =>
        sendApplicationStatusEmail({
            userId,
            email: to,
            studentName,
            jobTitle,
            status,
        }),
    );
};

module.exports = {
    sendApplicationStatusNotification,
};
