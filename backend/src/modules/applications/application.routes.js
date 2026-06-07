const express = require('express');

const {
    applyToJobController,
    getJobApplicationsController,
    getMyApplicationsController,
    getPreApplicationScoreController,
    getStudentDashboardController,
} = require('./application.controller');

const protect = require('../../middleware/authMiddleware');

const authorizeRoles = require('../../middleware/roleMiddleware');

const router = express.Router();

// Student Apply To Job
router.post('/apply', protect, authorizeRoles('student'), applyToJobController);

// Student Get Pre-Application AI Match Score
router.post(
    '/pre-application-score',
    protect,
    authorizeRoles('student'),
    getPreApplicationScoreController,
);

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

// Student Dashboard Stats
router.get(
    '/student/dashboard',
    protect,
    authorizeRoles('student'),
    getStudentDashboardController,
);

module.exports = router;
