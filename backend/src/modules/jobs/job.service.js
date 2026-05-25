const Job = require('./job.model');

// Create Job
const createJob = async (jobData) => {
    const job = await Job.create(jobData);

    return job;
};

// Get All Jobs
const getAllJobs = async () => {
    return await Job.find().populate('postedBy', 'name email');
};

// Get Single Job
const getJobById = async (jobId) => {
    return await Job.findById(jobId).populate('postedBy', 'name email');
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
};
