const express = require('express');

const logger = require('../config/logger');
const { sendDebugEmail } = require('../services/emailService');
const { getSmtpDiagnostics } = require('../services/smtpTransporter');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get(
    '/email',
    asyncHandler(async (req, res) => {
        try {
            const result = await sendDebugEmail();

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
                error: error.message,
                stack: error.stack,
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
