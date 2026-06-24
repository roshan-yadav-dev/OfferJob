const nodemailer = require('nodemailer');

const env = require('../config/env');
const logger = require('../config/logger');

let transporter = null;

function isSmtpConfigured() {
    return Boolean(
        env.MAIL_HOST &&
        env.MAIL_PORT &&
        env.MAIL_USERNAME &&
        env.MAIL_PASSWORD &&
        env.MAIL_FROM,
    );
}

function getTransporter() {
    if (!isSmtpConfigured()) {
        return null;
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: env.MAIL_HOST,
            port: env.MAIL_PORT,
            secure: env.MAIL_PORT === 587,
            auth: {
                user: env.MAIL_USERNAME,
                pass: env.MAIL_PASSWORD,
            },
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
        });
    }

    return transporter;
}

async function verifySmtpConnection() {
    if (!isSmtpConfigured()) {
        console.log('SMTP Verification Failed');
        logger.error('SMTP verification failed', {
            error_message:
                'SMTP environment variables are not fully configured',
        });
        return false;
    }

    /*try {
        await getTransporter().verify();
        console.log('SMTP Server Ready');
        logger.info('SMTP connection verified');
        return true;
    } catch (error) {
        console.log('SMTP Verification Failed');
        logger.error('SMTP verification failed', {
            error_message: error.message,
        });
        return false;
    }*/
}

module.exports = {
    getTransporter,
    isSmtpConfigured,
    verifySmtpConnection,
};
