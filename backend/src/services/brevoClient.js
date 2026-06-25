const net = require('net');
const dns = require('dns');
const axios = require('axios');

const env = require('../config/env');
const logger = require('../config/logger');

let brevoClient = null;

const BREVO_API_BASE_URL = 'https://api.brevo.com/v3';
const BREVO_SEND_EMAIL_PATH = '/smtp/email';
const BREVO_REQUEST_TIMEOUT_MS = 30000;
const BREVO_API_HOST = new URL(BREVO_API_BASE_URL).hostname;
const BREVO_API_PORT = 443;

function getMailFromSender(mailFrom = env.MAIL_FROM) {
    const trimmedMailFrom = (mailFrom || '').trim();

    if (!trimmedMailFrom) {
        return {
            email: '',
            name: '',
        };
    }

    const mailboxMatch = trimmedMailFrom.match(
        /^(?:"?([^"]*)"?\s*)?<([^>]+)>$/,
    );

    if (mailboxMatch) {
        const [, rawName = '', rawEmail = ''] = mailboxMatch;

        return {
            email: rawEmail.trim(),
            name: rawName.trim() || env.EMAIL_SENDER_NAME,
        };
    }

    return {
        email: trimmedMailFrom,
        name: env.EMAIL_SENDER_NAME,
    };
}

function isBrevoConfigured() {
    const sender = getMailFromSender();

    return Boolean(env.BREVO_API_KEY && sender.email);
}

function getBrevoConfigSummary() {
    const sender = getMailFromSender();

    return {
        provider: 'brevo',
        base_url: BREVO_API_BASE_URL,
        send_email_path: BREVO_SEND_EMAIL_PATH,
        request_timeout: BREVO_REQUEST_TIMEOUT_MS,
        api_key_present: Boolean(env.BREVO_API_KEY),
        sender_email: sender.email || null,
        sender_name: sender.name || null,
        mail_from: env.MAIL_FROM,
    };
}

async function resolveBrevoApiDns(host = BREVO_API_HOST) {
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

    logger.info('Brevo API DNS diagnostics', {
        api_host: diagnostics.host,
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

function connectToBrevoApiHost({
    host,
    port = BREVO_API_PORT,
    timeout = BREVO_REQUEST_TIMEOUT_MS,
}) {
    return new Promise((resolve) => {
        const socket = net.connect({
            host,
            port,
        });

        let settled = false;

        function finish(apiReachable, error = null) {
            if (settled) {
                return;
            }

            settled = true;
            socket.destroy();

            if (error) {
                logger.error('Direct Brevo API socket test failed', {
                    api_host: BREVO_API_HOST,
                    api_ip: host,
                    api_port: port,
                    error_message: error.message,
                    error_code: error.code || null,
                    stack: error.stack || null,
                });
            } else {
                logger.info('Direct Brevo API socket test succeeded', {
                    api_host: BREVO_API_HOST,
                    api_ip: host,
                    api_port: port,
                });
            }

            resolve(apiReachable);
        }

        socket.setTimeout(timeout);
        socket.once('connect', () => finish(true));
        socket.once('timeout', () =>
            finish(false, new Error('Brevo API socket connection timed out')),
        );
        socket.once('error', (error) => finish(false, error));
    });
}

async function getBrevoDiagnostics() {
    const sender = getMailFromSender();
    const dnsDiagnostics = await resolveBrevoApiDns();

    return {
        configured: isBrevoConfigured(),
        provider: 'brevo',
        host: BREVO_API_HOST,
        port: BREVO_API_PORT,
        apiKeyPresent: Boolean(env.BREVO_API_KEY),
        mailFrom: env.MAIL_FROM,
        senderEmail: sender.email || null,
        dnsResolved: Boolean(dnsDiagnostics.resolvedIp),
        apiReachable: dnsDiagnostics.resolvedIp
            ? await connectToBrevoApiHost({
                  host: dnsDiagnostics.resolvedIp,
                  port: BREVO_API_PORT,
              })
            : false,
    };
}

function getBrevoClient() {
    if (!isBrevoConfigured()) {
        return null;
    }

    if (!brevoClient) {
        logger.info('Creating Brevo API client', {
            brevo_config: getBrevoConfigSummary(),
        });

        brevoClient = axios.create({
            baseURL: BREVO_API_BASE_URL,
            timeout: BREVO_REQUEST_TIMEOUT_MS,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': env.BREVO_API_KEY,
            },
        });
    }

    return brevoClient;
}

module.exports = {
    BREVO_SEND_EMAIL_PATH,
    getBrevoClient,
    getBrevoDiagnostics,
    getBrevoConfigSummary,
    getMailFromSender,
    isBrevoConfigured,
    resolveBrevoApiDns,
};
