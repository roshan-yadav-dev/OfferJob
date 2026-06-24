const express = require('express');

const { isEmailServiceConfigured } = require('../services/emailService');

const router = express.Router();

router.get('/email', (req, res) => {
    const configured = isEmailServiceConfigured();

    if (!configured) {
        return res.status(503).json({
            service: 'email',
            status: 'unhealthy',
        });
    }

    res.status(200).json({
        service: 'email',
        status: 'healthy',
    });
});

module.exports = router;
