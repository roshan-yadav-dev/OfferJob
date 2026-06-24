const dns = require('dns');
const net = require('net');
const tls = require('tls');
const nodemailer = require('nodemailer');

const env = require('../config/env');
const logger = require('../config/logger');

dns.setDefaultResultOrder('ipv4first');

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

function createIpv4SmtpSocket(options, callback) {
    dns.lookup(options.host, { family: 4 }, (dnsError, address, family) => {
        if (dnsError) {
            logger.error('SMTP IPv4 DNS resolution failed', {
                smtp_host: options.host,
                error_message: dnsError.message,
            });
            return callback(dnsError);
        }

        logger.info('SMTP host resolved to IPv4 address', {
            smtp_host: options.host,
            smtp_ip: address,
            family,
        });

        const socketOptions = {
            host: address,
            port: options.port,
            family: 4,
            servername: options.host,
        };

        if (options.localAddress) {
            socketOptions.localAddress = options.localAddress;
        }

        const socket = options.secure
            ? tls.connect(
                  {
                      ...socketOptions,
                      ...(options.tls || {}),
                  },
                  () => {
                      socket.removeListener('error', onSocketError);
                      callback(null, { connection: socket, secured: true });
                  },
              )
            : net.connect(socketOptions, () => {
                  socket.removeListener('error', onSocketError);
                  callback(null, { connection: socket, secured: false });
              });

        function onSocketError(socketError) {
            callback(socketError);
        }

        socket.once('error', onSocketError);
    });
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
            family: 4,
            getSocket: createIpv4SmtpSocket,
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
