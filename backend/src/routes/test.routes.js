const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const { sendTestEmail } = require('../services/emailService');

const router = express.Router();

router.post(
    '/email',
    asyncHandler(async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'email is required',
            });
        }

        await sendTestEmail({ email });

        res.status(200).json({
            success: true,
            message: 'Test email sent successfully',
        });
    }),
);

module.exports = router;
