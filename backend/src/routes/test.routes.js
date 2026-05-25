const express = require('express');

const protect = require('../middleware/authMiddleware');

const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Recruiter Only Route
router.get('/recruiter', protect, authorizeRoles('recruiter'), (req, res) => {
    res.json({
        success: true,
        message: 'Recruiter route accessed',
    });
});

module.exports = router;
