const Application = require('./application.model');

// Create Application
const createApplication = async (applicationData) => {
    // Prevent duplicate application
    const existingApplication = await Application.findOne({
        student: applicationData.student,
        job: applicationData.job,
    });

    if (existingApplication) {
        const error = new Error('Already applied to this job');

        error.statusCode = 400;

        throw error;
    }

    const application = await Application.create(applicationData);

    return application;
};

// Get Applications For Job
const getApplicationsByJob = async (jobId) => {
    return await Application.find({
        job: jobId,
    })
        .populate('student', 'name email')
        .populate('job', 'title company');
};

// Get Student Applications
const getStudentApplications = async (studentId) => {
    return await Application.find({
        student: studentId,
    }).populate('job', 'title company location');
};

module.exports = {
    createApplication,
    getApplicationsByJob,
    getStudentApplications,
};
