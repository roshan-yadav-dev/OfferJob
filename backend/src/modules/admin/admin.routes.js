const express = require('express');

const adminOnly = require('../../middleware/adminMiddleware');

const {
    getDashboardController,
    getAnalyticsController,
    getJobsController,
    getJobByIdController,
    updateJobStatusController,
    getRecruitersController,
    updateRecruiterStatusController,
    getStudentsController,
    updateStudentStatusController,
} = require('./admin.controller');

const router = express.Router();

router.get('/dashboard', ...adminOnly, getDashboardController);
router.get('/analytics', ...adminOnly, getAnalyticsController);

router.get('/jobs', ...adminOnly, getJobsController);
router.get('/jobs/:id', ...adminOnly, getJobByIdController);
router.patch('/jobs/:id/status', ...adminOnly, updateJobStatusController);

router.get('/recruiters', ...adminOnly, getRecruitersController);
router.patch('/recruiters/:id/status', ...adminOnly, updateRecruiterStatusController);

router.get('/students', ...adminOnly, getStudentsController);
router.patch('/students/:id/status', ...adminOnly, updateStudentStatusController);

module.exports = router;
