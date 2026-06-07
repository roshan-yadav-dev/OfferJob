const asyncHandler = require('../../utils/asyncHandler');

const {
    getRecruiterJobs,
    getJobApplicants,
    getRecruiterDashboardStats,
    updateApplicationStatus,
} = require('./recruiter.service');
const {
    sendApplicationStatusNotification,
} = require('../../services/notificationService');

// Get Recruiter Jobs
const getRecruiterJobsController = asyncHandler(async (req, res) => {
    const jobs = await getRecruiterJobs(req.user._id);

    res.status(200).json({
        success: true,
        jobs,
    });
});

// Get Applicants For Specific Job
const getJobApplicantsController = asyncHandler(async (req, res) => {
    const applications = await getJobApplicants(req.user._id, req.params.jobId);

    res.status(200).json({
        success: true,
        applications,
    });
});

// Recruiter Dashboard Stats
const getDashboardStatsController = asyncHandler(async (req, res) => {
    const stats = await getRecruiterDashboardStats(req.user._id);

    res.status(200).json({
        success: true,
        stats,
    });
});

// Update Application Status
const updateApplicationStatusController = asyncHandler(async (req, res) => {
    const application = await updateApplicationStatus(
        req.user._id,
        req.params.applicationId,
        req.body.status,
    );

    await sendApplicationStatusNotification({
        to: application.student.email,

        studentName: application.student.name,

        jobTitle: application.job.title,

        status: application.status.toUpperCase(),
    });

    res.status(200).json({
        success: true,
        message: 'Application status updated',
        application,
    });
});

module.exports = {
    getRecruiterJobsController,
    getJobApplicantsController,
    getDashboardStatsController,
    updateApplicationStatusController,
};
