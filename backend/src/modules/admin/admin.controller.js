const mongoose = require('mongoose');
const asyncHandler = require('../../utils/asyncHandler');
const {
    getDashboardStats,
    getAnalytics,
    getAdminJobs,
    getAdminJobById,
    updateJobStatus,
    getUsersByRole,
    updateUserActiveStatus,
} = require('./admin.service');

const getDashboardController = asyncHandler(async (req, res) => {
    const stats = await getDashboardStats();

    res.status(200).json({
        success: true,
        stats,
    });
});

const getAnalyticsController = asyncHandler(async (req, res) => {
    const analytics = await getAnalytics();

    res.status(200).json({
        success: true,
        analytics,
    });
});

const getJobsController = asyncHandler(async (req, res) => {
    const { search = '', status = '' } = req.query;

    const jobs = await getAdminJobs({ search, status });

    res.status(200).json({
        success: true,
        jobs,
    });
});

const getJobByIdController = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID',
        });
    }

    const job = await getAdminJobById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found',
        });
    }

    res.status(200).json({
        success: true,
        job,
    });
});

const updateJobStatusController = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID',
        });
    }

    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'Status is required',
        });
    }

    try {
        const job = await updateJobStatus(req.params.id, status);

        res.status(200).json({
            success: true,
            message: `Job status updated to ${status}`,
            job,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

const getRecruitersController = asyncHandler(async (req, res) => {
    const { search = '' } = req.query;
    const recruiters = await getUsersByRole('recruiter', { search });

    res.status(200).json({
        success: true,
        recruiters,
    });
});

const updateRecruiterStatusController = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid recruiter ID',
        });
    }

    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'isActive must be a boolean',
        });
    }

    try {
        const recruiter = await updateUserActiveStatus(
            req.params.id,
            isActive,
            'recruiter',
        );

        res.status(200).json({
            success: true,
            message: `Recruiter ${isActive ? 'activated' : 'suspended'} successfully`,
            recruiter,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
});

const getStudentsController = asyncHandler(async (req, res) => {
    const { search = '' } = req.query;
    const students = await getUsersByRole('student', { search });

    res.status(200).json({
        success: true,
        students,
    });
});

const updateStudentStatusController = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid student ID',
        });
    }

    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'isActive must be a boolean',
        });
    }

    try {
        const student = await updateUserActiveStatus(
            req.params.id,
            isActive,
            'student',
        );

        res.status(200).json({
            success: true,
            message: `Student ${isActive ? 'activated' : 'suspended'} successfully`,
            student,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = {
    getDashboardController,
    getAnalyticsController,
    getJobsController,
    getJobByIdController,
    updateJobStatusController,
    getRecruitersController,
    updateRecruiterStatusController,
    getStudentsController,
    updateStudentStatusController,
};
