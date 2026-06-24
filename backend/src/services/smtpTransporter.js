const dns = require('dns');
const net = require('net');
const tls = require('tls');
const nodemailer = require('nodemailer');

const env = require('../config/env');
const logger = require('../config/logger');

dns.setDefaultResultOrder('ipv4first');

let transporter = null;

const SMTP_TIMEOUT_MS = 30000;

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
        secure: env.MAIL_PORT === 587,
        family: 4,
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
            .lookup(host, { family: 4 })
            .then((result) => ({ ...result, error: null }))
            .catch((error) => ({ address: null, family: null, error })),
    ]);

    const diagnostics = {
        host,
        ipv4Addresses: ipv4Result.addresses,
        ipv6Addresses: ipv6Result.addresses,
        resolvedIp: lookupResult.address || ipv4Result.addresses[0] || null,
        family: lookupResult.family || (ipv4Result.addresses.length ? 4 : null),
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
            family: 4,
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

function createIpv4SmtpSocket(options, callback) {
    resolveSmtpDns(options.host)
        .then(({ resolvedIp, family, lookupError }) => {
            if (!resolvedIp) {
                const error = new Error(
                    lookupError || 'SMTP host did not resolve to IPv4',
                );

                logger.error('SMTP IPv4 DNS resolution failed', {
                    smtp_host: options.host,
                    error_message: error.message,
                });

                return callback(error);
            }

            logger.info('SMTP host resolved to IPv4 address', {
                smtp_host: options.host,
                smtp_ip: resolvedIp,
                family,
            });

            const socketOptions = {
                host: resolvedIp,
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
                      callback(null, {
                          connection: socket,
                          secured: false,
                      });
                  });

            function onSocketError(socketError) {
                callback(socketError);
            }

            socket.once('error', onSocketError);
        })
        .catch((error) => callback(error));
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
            secure: env.MAIL_PORT === 485,
            auth: {
                user: env.MAIL_USERNAME,
                pass: env.MAIL_PASSWORD,
            },
            connectionTimeout: SMTP_TIMEOUT_MS,
            greetingTimeout: SMTP_TIMEOUT_MS,
            socketTimeout: SMTP_TIMEOUT_MS,
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

    const dnsDiagnostics = await resolveSmtpDns();

    logger.info('SMTP verification starting', {
        smtp_host: env.MAIL_HOST,
        resolved_ip: dnsDiagnostics.resolvedIp,
        family: dnsDiagnostics.family,
        transporter_config: getTransporterConfigSummary(),
    });

    try {
        await getTransporter().verify();
        console.log('SMTP Server Ready');
        logger.info('SMTP connection verified', {
            smtp_host: env.MAIL_HOST,
            resolved_ip: dnsDiagnostics.resolvedIp,
            family: dnsDiagnostics.family,
            transporter_config: getTransporterConfigSummary(),
        });
        return true;
    } catch (error) {
        console.log('SMTP Verification Failed');
        logger.error('SMTP verification failed', {
            error_message: error.message,
            error_code: error.code || null,
            error_command: error.command || null,
            stack: error.stack || null,
        });
        return false;
    }
}

module.exports = {
    getTransporter,
    getSmtpDiagnostics,
    getTransporterConfigSummary,
    isSmtpConfigured,
    resolveSmtpDns,
    verifySmtpConnection,
};
