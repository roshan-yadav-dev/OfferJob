const { randomUUID } = require('crypto');

const env = require('../config/env');
const logger = require('../config/logger');
const Notification = require('../modules/notifications/notification.model');
const emailTemplates = require('../templates/emails');
const {
    getTransporter,
    getTransporterConfigSummary,
    getMailFromSender,
    isSmtpConfigured,
} = require('./smtpTransporter');

const MAX_SEND_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

function interpolateTemplate(html) {
    return html.replaceAll('{{FRONTEND_URL}}', env.FRONTEND_URL);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createNotificationRecord({
    userId,
    email,
    type,
    title,
    message,
    metadata = {},
}) {
    return Notification.create({
        userId,
        email,
        type,
        title,
        message,
        status: 'PENDING',
        metadata,
    });
}

function createBrevoSendPayload({ to, subject, html }) {
    const sender = getMailFromSender();

    return {
        sender: {
            email: sender.email,
            ...(sender.name ? { name: sender.name } : {}),
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
    };
}

function createBrevoSendResult({ to, response }) {
    const sender = getMailFromSender();

    return {
        accepted: [to],
        rejected: [],
        response: response?.data || null,
        messageId: response?.data?.messageId || null,
        envelope: {
            from: sender.email || env.MAIL_FROM,
            to: [to],
        },
        status: response?.status || null,
    };
}

async function sendWithRetry({ to, subject, html }) {
    const transporter = getTransporter();

    if (!transporter) {
        throw new Error('SMTP is not configured');
    }

    let lastError = null;

    for (let attempt = 1; attempt <= MAX_SEND_ATTEMPTS; attempt += 1) {
        const mailOptions = {
            from: env.MAIL_FROM,
            to,
            subject,
            html,
        };
        const requestPayload = createBrevoSendPayload(mailOptions);

        logger.info('Brevo email API request started', {
            attempt,
            max_attempts: MAX_SEND_ATTEMPTS,
            recipient: to,
            sender: env.MAIL_FROM,
            subject,
            brevo_endpoint: '/smtp/email',
            brevo_config: getTransporterConfigSummary(),
        });

        try {
            const response = await transporter.post('/smtp/email', requestPayload);
            const info = createBrevoSendResult({ to, response });

            logger.info('Brevo email API request success', {
                attempt,
                recipient: to,
                sender: env.MAIL_FROM,
                subject,
                http_status: response.status,
                brevo_response: response.data || null,
                message_id: info?.messageId || null,
                success: true,
                accepted: info?.accepted || [],
                rejected: info?.rejected || [],
                response: info?.response || null,
                messageId: info?.messageId || null,
                envelope: info?.envelope || null,
            });

            return info;
        } catch (error) {
            lastError = error;

            logger.error('Brevo email API request failed', {
                attempt,
                max_attempts: MAX_SEND_ATTEMPTS,
                recipient: to,
                sender: env.MAIL_FROM,
                subject,
                http_status: error.response?.status || null,
                brevo_response: error.response?.data || null,
                message_id: error.response?.data?.messageId || null,
                success: false,
                error_message: error.message,
                error_code: error.code || null,
                error_command: error.command || null,
                stack: error.stack || null,
            });

            if (attempt < MAX_SEND_ATTEMPTS) {
                await sleep(RETRY_DELAY_MS * attempt);
            }
        }
    }

    throw lastError;
}

async function deliverEmail({
    userId,
    email,
    type,
    title,
    subject,
    html,
    metadata = {},
}) {
    const interpolatedHtml = interpolateTemplate(html);
    const notification = await createNotificationRecord({
        userId,
        email,
        type,
        title,
        message: interpolatedHtml,
        metadata,
    });

    try {
        const result = await sendWithRetry({
            to: email,
            subject,
            html: interpolatedHtml,
        });

        notification.status = 'SENT';
        notification.metadata = {
            ...notification.metadata,
            messageId: result?.messageId || null,
        };
        await notification.save();

        logger.info('Email sent successfully', {
            notification_id: notification._id.toString(),
            type,
            to: email,
            message_id: result?.messageId || null,
        });

        return notification;
    } catch (error) {
        notification.status = 'FAILED';
        notification.metadata = {
            ...notification.metadata,
            error: error.message,
        };
        await notification.save();

        logger.error('Email delivery failed', {
            notification_id: notification._id.toString(),
            type,
            to: email,
            error_message: error.message,
        });

        throw error;
    }
}

function dispatchEmail(promiseFactory) {
    Promise.resolve()
        .then(promiseFactory)
        .catch((error) => {
            logger.error('Background email dispatch failed', {
                error_message: error.message,
            });
        });
}

async function sendWelcomeEmail({ userId, email, name }) {
    const html = emailTemplates.renderWelcomeEmail({ name });

    return deliverEmail({
        userId,
        email,
        type: 'WELCOME',
        title: `Welcome to ${env.APP_NAME}`,
        subject: `Welcome to ${env.APP_NAME}`,
        html,
        metadata: { name },
    });
}

async function sendApplicationSubmittedEmail({
    userId,
    email,
    studentName,
    jobTitle,
    company,
}) {
    const html = emailTemplates.renderApplicationSubmittedEmail({
        studentName,
        jobTitle,
        company,
    });

    return deliverEmail({
        userId,
        email,
        type: 'APPLICATION_SUBMITTED',
        title: 'Application Submitted',
        subject: `Application received: ${jobTitle}`,
        html,
        metadata: { jobTitle, company },
    });
}

async function sendRecruiterNotificationEmail({
    userId,
    email,
    recruiterName,
    studentName,
    jobTitle,
    company,
}) {
    const html = emailTemplates.renderRecruiterNotificationEmail({
        recruiterName,
        studentName,
        jobTitle,
        company,
    });

    return deliverEmail({
        userId,
        email,
        type: 'RECRUITER_NEW_APPLICATION',
        title: 'New Application Received',
        subject: `New application for ${jobTitle}`,
        html,
        metadata: { studentName, jobTitle, company },
    });
}

async function sendPasswordResetEmail({ userId, email, name, resetToken }) {
    const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = emailTemplates.renderPasswordResetEmail({ name, resetUrl });

    return deliverEmail({
        userId,
        email,
        type: 'PASSWORD_RESET',
        title: 'Password Reset Request',
        subject: `Reset your ${env.APP_NAME} password`,
        html,
        metadata: { resetUrl },
    });
}

async function sendInterviewInviteEmail({
    userId,
    email,
    studentName,
    jobTitle,
    company,
    interviewDate,
    interviewTime,
    interviewLocation,
    notes,
}) {
    const html = emailTemplates.renderInterviewInviteEmail({
        studentName,
        jobTitle,
        company,
        interviewDate,
        interviewTime,
        interviewLocation,
        notes,
    });

    return deliverEmail({
        userId,
        email,
        type: 'INTERVIEW_INVITATION',
        title: 'Interview Invitation',
        subject: `Interview invitation: ${jobTitle}`,
        html,
        metadata: {
            jobTitle,
            company,
            interviewDate,
            interviewTime,
            interviewLocation,
        },
    });
}

async function sendApplicationStatusEmail({
    userId,
    email,
    studentName,
    jobTitle,
    status,
}) {
    const html = emailTemplates.renderApplicationStatusEmail({
        studentName,
        jobTitle,
        status,
    });

    return deliverEmail({
        userId,
        email,
        type: 'APPLICATION_STATUS',
        title: 'Application Status Update',
        subject: `Application status update: ${jobTitle}`,
        html,
        metadata: { jobTitle, status },
    });
}

async function sendTestEmail({ email }) {
    return sendWithRetry({
        to: email,
        subject: `${env.APP_NAME} - SMTP Test Email`,
        html: `<p>This is a test email from <strong>${env.APP_NAME}</strong>.</p><p>If you received this, SMTP email delivery is configured correctly.</p>`,
    });
}

async function sendDebugEmail() {
    const timestamp = new Date().toISOString();
    const serverTime = new Date().toString();
    const debugUuid = randomUUID();
    const sender = getMailFromSender();

    return sendWithRetry({
        to: env.MAIL_USERNAME || sender.email,
        subject: 'SMTP Debug Test',
        html: `<p>Timestamp: ${timestamp}</p><p>Server Time: ${serverTime}</p><p>Random UUID: ${debugUuid}</p>`,
    });
}

function isEmailServiceConfigured() {
    return isSmtpConfigured();
}

module.exports = {
    dispatchEmail,
    sendWelcomeEmail,
    sendApplicationSubmittedEmail,
    sendRecruiterNotificationEmail,
    sendPasswordResetEmail,
    sendInterviewInviteEmail,
    sendApplicationStatusEmail,
    sendTestEmail,
    sendDebugEmail,
    isEmailServiceConfigured,
};
