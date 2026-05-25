const mongoose = require('mongoose');

const {
    createApplication,
    getApplicationsByJob,
    getStudentApplications,
} = require('./application.service');

const asyncHandler = require('../../utils/asyncHandler');

// Apply To Job
const applyToJobController = asyncHandler(async (req, res) => {
    const { jobId, resumeUrl } = req.body;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID',
        });
    }

    // Validate Resume URL
    if (!resumeUrl) {
        return res.status(400).json({
            success: false,
            message: 'Resume URL is required',
        });
    }

    const applicationData = {
        student: req.user._id,
        job: jobId,
        resumeUrl,
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

module.exports = {
    applyToJobController,
    getJobApplicationsController,
    getMyApplicationsController,
};
