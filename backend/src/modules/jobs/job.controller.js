const mongoose = require('mongoose');
const asyncHandler = require('../../utils/asyncHandler');

const { createJob, getAllJobs, getJobById } = require('./job.service');

// Create Job
const createJobController = asyncHandler(async (req, res) => {
    const jobData = {
        ...req.body,
        postedBy: req.user._id,
    };

    const job = await createJob(jobData);

    res.status(201).json({
        success: true,
        message: 'Job created successfully',
        job,
    });
});

// Get All Jobs
const getJobsController = asyncHandler(async (req, res) => {
    const jobs = await getAllJobs();

    res.status(200).json({
        success: true,
        jobs,
    });
});

// Get Single Job
const getJobController = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID',
        });
    }

    const job = await getJobById(req.params.id);

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

module.exports = {
    createJobController,
    getJobsController,
    getJobController,
};
