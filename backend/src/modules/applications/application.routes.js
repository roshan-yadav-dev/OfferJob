const express = require('express');

const {
    applyToJobController,
    getJobApplicationsController,
    getMyApplicationsController,
} = require('./application.controller');

const protect = require('../../middleware/authMiddleware');

const authorizeRoles = require('../../middleware/roleMiddleware');

const router = express.Router();

// Student Apply To Job
router.post('/apply', protect, authorizeRoles('student'), applyToJobController);

// Recruiter View Applicants
router.get(
    '/job/:jobId',
    protect,
    authorizeRoles('recruiter'),
    getJobApplicationsController,
);

// Student View Own Applications
router.get(
    '/my-applications',
    protect,
    authorizeRoles('student'),
    getMyApplicationsController,
);

module.exports = router;
