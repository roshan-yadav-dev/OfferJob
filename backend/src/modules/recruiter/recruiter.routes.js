const express = require('express');

const {
    getRecruiterJobsController,
    getJobApplicantsController,
    getDashboardStatsController,
    updateApplicationStatusController,
    sendInterviewInviteController,
} = require('./recruiter.controller');

const protect = require('../../middleware/authMiddleware');

const authorizeRoles = require('../../middleware/roleMiddleware');

const router = express.Router();

// Protect All Recruiter Routes
router.use(protect, authorizeRoles('recruiter'));

// Get Recruiter Jobs
router.get('/jobs', getRecruiterJobsController);

// Get Applicants Per Job
router.get('/jobs/:jobId/applications', getJobApplicantsController);

// Update Application Status
router.patch(
    '/applications/:applicationId/status',
    updateApplicationStatusController,
);

// Send Interview Invitation
router.post(
    '/applications/:applicationId/interview-invite',
    sendInterviewInviteController,
);

// Dashboard Stats
router.get('/dashboard', getDashboardStatsController);

module.exports = router;
