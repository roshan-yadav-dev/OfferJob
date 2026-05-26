const Job = require('../jobs/job.model');

const Application = require('../applications/application.model');

// Get Recruiter Jobs
const getRecruiterJobs = async (recruiterId) => {
    return await Job.find({
        postedBy: recruiterId,
    })
        .sort({ createdAt: -1 })
        .lean();
};

// Get Applications For Recruiter Job
const getJobApplicants = async (recruiterId, jobId) => {
    // Verify Job Ownership
    const job = await Job.findOne({
        _id: jobId,
        postedBy: recruiterId,
    });

    if (!job) {
        throw new Error('Job not found or unauthorized');
    }

    // Get Applications
    const applications = await Application.find({
        job: jobId,
    })
        .populate('student', 'name email')
        .populate('job', 'title company')
        .sort({
            createdAt: -1,
        })
        .lean();

    return applications;
};

// Recruiter Dashboard Stats
const getRecruiterDashboardStats = async (recruiterId) => {
    // Total Jobs
    const totalJobs = await Job.countDocuments({
        postedBy: recruiterId,
    });

    // Recruiter Jobs
    const recruiterJobs = await Job.find({
        postedBy: recruiterId,
    }).select('_id');

    const jobIds = recruiterJobs.map((job) => job._id);

    // Total Applications
    const totalApplications = await Application.countDocuments({
        job: {
            $in: jobIds,
        },
    });

    // Shortlisted Applications
    const shortlistedApplications = await Application.countDocuments({
        job: {
            $in: jobIds,
        },
        status: 'shortlisted',
    });

    return {
        totalJobs,
        totalApplications,
        shortlistedApplications,
    };
};

// Update Application Status
const updateApplicationStatus = async (recruiterId, applicationId, status) => {
    // Allowed Status Values
    const allowedStatuses = [
        'pending',
        'reviewed',
        'shortlisted',
        'rejected',
        'accepted',
    ];

    // Validate Status
    if (!allowedStatuses.includes(status)) {
        throw new Error('Invalid application status');
    }

    // Find Application
    const application = await Application.findById(applicationId)
        .populate('job')
        .populate('student', 'name email');

    if (!application) {
        throw new Error('Application not found');
    }

    // Verify Recruiter Ownership
    if (application.job.postedBy.toString() !== recruiterId.toString()) {
        throw new Error('Unauthorized access');
    }

    // Prevent Duplicate Updates
    if (application.status === status) {
        throw new Error(`Application already marked as ${status}`);
    }

    // Update Status
    application.status = status;

    await application.save();

    return application;
};

module.exports = {
    getRecruiterJobs,
    getJobApplicants,
    getRecruiterDashboardStats,
    updateApplicationStatus,
};
