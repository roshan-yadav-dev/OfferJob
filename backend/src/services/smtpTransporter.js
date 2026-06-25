const net = require('net');
const nodemailer = require('nodemailer');
const dns = require('dns');

const env = require('../config/env');
const logger = require('../config/logger');

let transporter = null;

const SMTP_TIMEOUT_MS = 30000;

function isSecureSmtpConnection() {
    return env.MAIL_PORT === 465;
}

function shouldRequireTls() {
    return !isSecureSmtpConnection();
}

function isSmtpConfigured() {
    return Boolean(
        env.MAIL_HOST &&
        env.MAIL_PORT &&
        env.MAIL_USERNAME &&
        env.MAIL_PASSWORD &&
        env.MAIL_FROM,
    );
}

function getTransporterConfigSummary() {
    return {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: isSecureSmtpConnection(),
        requireTLS: shouldRequireTls(),
        connectionTimeout: SMTP_TIMEOUT_MS,
        greetingTimeout: SMTP_TIMEOUT_MS,
        socketTimeout: SMTP_TIMEOUT_MS,
        usernamePresent: Boolean(env.MAIL_USERNAME),
        passwordPresent: Boolean(env.MAIL_PASSWORD),
        mailFrom: env.MAIL_FROM,
    };
}

async function resolveSmtpDns(host = env.MAIL_HOST) {
    const [ipv4Result, ipv6Result, lookupResult] = await Promise.all([
        dns.promises
            .resolve4(host)
            .then((addresses) => ({ addresses, error: null }))
            .catch((error) => ({ addresses: [], error })),
        dns.promises
            .resolve6(host)
            .then((addresses) => ({ addresses, error: null }))
            .catch((error) => ({ addresses: [], error })),
        dns.promises
            .lookup(host, { all: true })
            .then((addresses) => ({ addresses, error: null }))
            .catch((error) => ({ addresses: [], error })),
    ]);

    const resolvedAddress =
        lookupResult.addresses[0]?.address ||
        ipv4Result.addresses[0] ||
        ipv6Result.addresses[0] ||
        null;
    const resolvedFamily =
        lookupResult.addresses[0]?.family ||
        (ipv4Result.addresses.length ? 4 : null) ||
        (ipv6Result.addresses.length ? 6 : null);

    const diagnostics = {
        host,
        ipv4Addresses: ipv4Result.addresses,
        ipv6Addresses: ipv6Result.addresses,
        resolvedIp: resolvedAddress,
        family: resolvedFamily,
        ipv4Error: ipv4Result.error?.message || null,
        ipv6Error: ipv6Result.error?.message || null,
        lookupError: lookupResult.error?.message || null,
    };

    logger.info('SMTP DNS diagnostics', {
        smtp_host: diagnostics.host,
        ipv4_addresses: diagnostics.ipv4Addresses,
        ipv6_addresses: diagnostics.ipv6Addresses,
        resolved_ip: diagnostics.resolvedIp,
        family: diagnostics.family,
        ipv4_error: diagnostics.ipv4Error,
        ipv6_error: diagnostics.ipv6Error,
        lookup_error: diagnostics.lookupError,
    });

    return diagnostics;
}

function connectToSmtpHost({ host, port, timeout = SMTP_TIMEOUT_MS }) {
    return new Promise((resolve) => {
        const socket = net.connect({
            host,
            port,
        });

        let settled = false;

        function finish(smtpReachable, error = null) {
            if (settled) {
                return;
            }

            settled = true;
            socket.destroy();

            if (error) {
                logger.error('Direct SMTP socket test failed', {
                    smtp_host: env.MAIL_HOST,
                    smtp_ip: host,
                    smtp_port: port,
                    error_message: error.message,
                    error_code: error.code || null,
                    stack: error.stack || null,
                });
            } else {
                logger.info('Direct SMTP socket test succeeded', {
                    smtp_host: env.MAIL_HOST,
                    smtp_ip: host,
                    smtp_port: port,
                });
            }

            resolve(smtpReachable);
        }

        socket.setTimeout(timeout);
        socket.once('connect', () => finish(true));
        socket.once('timeout', () =>
            finish(false, new Error('SMTP socket connection timed out')),
        );
        socket.once('error', (error) => finish(false, error));
    });
}

async function getSmtpDiagnostics() {
    const dnsDiagnostics = await resolveSmtpDns();

    return {
        smtpConfigured: isSmtpConfigured(),
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        usernamePresent: Boolean(env.MAIL_USERNAME),
        passwordPresent: Boolean(env.MAIL_PASSWORD),
        mailFrom: env.MAIL_FROM,
        dnsResolved: Boolean(dnsDiagnostics.resolvedIp),
        smtpReachable: dnsDiagnostics.resolvedIp
            ? await connectToSmtpHost({
                  host: dnsDiagnostics.resolvedIp,
                  port: env.MAIL_PORT,
              })
            : false,
    };
}

function getTransporter() {
    if (!isSmtpConfigured()) {
        return null;
    }

    if (!transporter) {
        logger.info('Creating SMTP transporter', {
            transporter_config: getTransporterConfigSummary(),
        });

        transporter = nodemailer.createTransport({
            host: env.MAIL_HOST,
            port: env.MAIL_PORT,
            secure: isSecureSmtpConnection(),
            requireTLS: shouldRequireTls(),
            auth: {
                user: env.MAIL_USERNAME,
                pass: env.MAIL_PASSWORD,
            },
            connectionTimeout: SMTP_TIMEOUT_MS,
            greetingTimeout: SMTP_TIMEOUT_MS,
            socketTimeout: SMTP_TIMEOUT_MS,
        });
    }

    return transporter;
}

module.exports = {
    getTransporter,
    getSmtpDiagnostics,
    getTransporterConfigSummary,
    isSmtpConfigured,
    resolveSmtpDns,
};
