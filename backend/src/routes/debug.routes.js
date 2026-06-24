const express = require('express');

const env = require('../config/env');
const logger = require('../config/logger');
const { sendTestEmail } = require('../services/emailService');
const {
    getSmtpDiagnostics,
    isSmtpConfigured,
} = require('../services/smtpTransporter');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get(
    '/email',
    asyncHandler(async (req, res) => {
        if (!isSmtpConfigured()) {
            return res.status(503).json({
                success: false,
                messageId: null,
                accepted: [],
                rejected: [],
                response: 'SMTP is not configured',
                envelope: null,
            });
        }

        try {
            const result = await sendTestEmail({ email: env.MAIL_USERNAME });

            return res.status(200).json({
                success: true,
                messageId: result?.messageId || null,
                accepted: result?.accepted || [],
                rejected: result?.rejected || [],
                response: result?.response || null,
                envelope: result?.envelope || null,
            });
        } catch (error) {
            logger.error('Debug email endpoint failed', {
                error_message: error.message,
                error_code: error.code || null,
                error_command: error.command || null,
                stack: error.stack || null,
            });

            return res.status(500).json({
                success: false,
                messageId: null,
                accepted: [],
                rejected: [],
                response: null,
                envelope: null,
                error: {
                    message: error.message,
                    code: error.code || null,
                    command: error.command || null,
                    stack: error.stack || null,
                },
            });
        }
    }),
);

router.get(
    '/smtp',
    asyncHandler(async (req, res) => {
        const diagnostics = await getSmtpDiagnostics();

        res.status(200).json(diagnostics);
    }),
);

module.exports = router;
