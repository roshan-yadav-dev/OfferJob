const Job = require('../jobs/job.model');

const createJob = async (jobData) => {
    const job = await Job.create({
        ...jobData,
        status: 'ACTIVE',
    });

    return job;
};

const getAllJobs = async () => {
    return await Job.find({
        $or: [{ status: 'ACTIVE' }, { status: { $exists: false } }],
    }).populate('postedBy', 'name email');
};

const getJobById = async (jobId, { allowAnyStatus = false } = {}) => {
    const query = { _id: jobId };

    if (!allowAnyStatus) {
        query.$or = [{ status: 'ACTIVE' }, { status: { $exists: false } }];
    }

    return await Job.findOne(query).populate('postedBy', 'name email');
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
};
