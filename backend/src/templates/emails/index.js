const { renderWelcomeEmail } = require('./welcome');
const { renderApplicationSubmittedEmail } = require('./applicationSubmitted');
const { renderRecruiterNotificationEmail } = require('./recruiterNotification');
const { renderPasswordResetEmail } = require('./passwordReset');
const { renderInterviewInviteEmail } = require('./interviewInvitation');
const { renderApplicationStatusEmail } = require('./applicationStatus');

module.exports = {
    renderWelcomeEmail,
    renderApplicationSubmittedEmail,
    renderRecruiterNotificationEmail,
    renderPasswordResetEmail,
    renderInterviewInviteEmail,
    renderApplicationStatusEmail,
};
