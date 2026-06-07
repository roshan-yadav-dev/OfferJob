const mongoose = require('mongoose');

const {
    createApplication,
    getApplicationsByJob,
    getStudentApplications,
    getStudentDashboardStats,
} = require('./application.service');

const asyncHandler = require('../../utils/asyncHandler');
const Job = require('../jobs/job.model');
const { extractResumeTextFromReference } = require('./application.service');
const { matchResumeToJob } = require('../../services/aiMatchingService');

// Apply To Job
const applyToJobController = asyncHandler(async (req, res) => {
    const { jobId, resumeUrl, resumePath } = req.body;
    const resumeReference = resumeUrl || resumePath;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID',
        });
    }

    // Validate Resume URL
    if (!resumeReference) {
        return res.status(400).json({
            success: false,
            message: 'Resume reference is required',
        });
    }

    const applicationData = {
        student: req.user._id,
        job: jobId,
        resumeUrl: resumeReference,
    };

    const application = await createApplication(applicationData);

    res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application,
    });
});

// Recruiter View Applicants
const getJobApplicationsController = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID',
        });
    }

    const applications = await getApplicationsByJob(jobId);

    res.status(200).json({
        success: true,
        applications,
    });
});

// Student View Own Applications
const getMyApplicationsController = asyncHandler(async (req, res) => {
    const applications = await getStudentApplications(req.user._id);

    res.status(200).json({
        success: true,
        applications,
    });
});

// Get Pre-Application AI Match Score
const getPreApplicationScoreController = asyncHandler(async (req, res) => {
    const { jobId } = req.body;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID',
        });
    }

    // Get job description
    const job = await Job.findById(jobId).select('description title').lean();
    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found',
        });
    }

    if (!job.description?.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Job description unavailable',
        });
    }

    // Get student resume URL
    const student = await mongoose
        .model('User')
        .findById(req.user._id)
        .select('resumeUrl')
        .lean();
    if (!student?.resumeUrl) {
        return res.status(400).json({
            success: false,
            message: 'Resume not uploaded',
        });
    }

    // Extract resume text
    const resumeText = await extractResumeTextFromReference(student.resumeUrl, {
        user_id: req.user._id.toString(),
        job_id: jobId,
        context: 'pre-application-score',
    });

    if (!resumeText) {
        return res.status(400).json({
            success: false,
            message: 'Unable to extract resume content',
        });
    }

    // Get matching score
    try {
        const similarityScore = await matchResumeToJob({
            resumeText,
            jobDescription: job.description,
            userId: req.user._id.toString(),
            jobId: jobId,
        });

        // Convert to percentage (0-100)
        const percentage = Math.round(similarityScore * 100);

        // Determine match category
        let matchCategory = 'Low Match';
        if (percentage >= 75) {
            matchCategory = 'Strong Match';
        } else if (percentage >= 50) {
            matchCategory = 'Moderate Match';
        }

        res.status(200).json({
            success: true,
            score: percentage,
            matchCategory,
            rawScore: similarityScore,
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'AI service temporarily unavailable',
            error: error.message,
        });
    }
});

// Student Dashboard Stats
const getStudentDashboardController = asyncHandler(async (req, res) => {
    const stats = await getStudentDashboardStats(req.user._id);

    res.status(200).json({
        success: true,
        stats,
    });
});

module.exports = {
    applyToJobController,
    getJobApplicationsController,
    getMyApplicationsController,
    getPreApplicationScoreController,
    getStudentDashboardController,
};
