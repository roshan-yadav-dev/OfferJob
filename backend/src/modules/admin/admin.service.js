const User = require('../users/user.model');
const Job = require('../jobs/job.model');
const Application = require('../applications/application.model');

const JOB_STATUSES = ['ACTIVE', 'CLOSED', 'DELETED'];

const getDashboardStats = async () => {
    const [totalStudents, totalRecruiters, totalJobs, totalApplications] =
        await Promise.all([
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'recruiter' }),
            Job.countDocuments({ status: { $ne: 'DELETED' } }),
            Application.countDocuments(),
        ]);

    return {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
    };
};

const getAnalytics = async () => {
    const [
        totalUsers,
        totalRecruiters,
        totalStudents,
        totalJobs,
        totalApplications,
        jobsByStatus,
        activeRecruiters,
        activeStudents,
    ] = await Promise.all([
        User.countDocuments({ role: { $in: ['student', 'recruiter'] } }),
        User.countDocuments({ role: 'recruiter' }),
        User.countDocuments({ role: 'student' }),
        Job.countDocuments(),
        Application.countDocuments(),
        Job.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        User.countDocuments({ role: 'recruiter', isActive: true }),
        User.countDocuments({ role: 'student', isActive: true }),
    ]);

    const statusBreakdown = jobsByStatus.reduce((acc, item) => {
        acc[item._id || 'UNKNOWN'] = item.count;
        return acc;
    }, {});

    return {
        totalUsers,
        totalRecruiters,
        totalStudents,
        totalJobs,
        totalApplications,
        activeRecruiters,
        activeStudents,
        jobsByStatus: statusBreakdown,
    };
};

const getAdminJobs = async ({ search = '', status = '' } = {}) => {
    const query = {};

    if (status && JOB_STATUSES.includes(status)) {
        query.status = status;
    }

    if (search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { company: regex }, { location: regex }];
    }

    return Job.find(query)
        .populate('postedBy', 'name email companyName isActive')
        .sort({ createdAt: -1 })
        .lean();
};

const getAdminJobById = async (jobId) => {
    return Job.findById(jobId)
        .populate('postedBy', 'name email companyName isActive')
        .lean();
};

const updateJobStatus = async (jobId, status) => {
    if (!JOB_STATUSES.includes(status)) {
        throw new Error('Invalid job status');
    }

    const job = await Job.findByIdAndUpdate(
        jobId,
        { status },
        { new: true, runValidators: true },
    ).populate('postedBy', 'name email companyName');

    if (!job) {
        throw new Error('Job not found');
    }

    return job;
};

const getUsersByRole = async (role, { search = '' } = {}) => {
    const query = { role };

    if (search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
            { name: regex },
            { email: regex },
            ...(role === 'recruiter' ? [{ companyName: regex }] : []),
            ...(role === 'student' ? [{ collegeName: regex }] : []),
        ];
    }

    return User.find(query)
        .select('name email role isActive companyName collegeName createdAt')
        .sort({ createdAt: -1 })
        .lean();
};

const updateUserActiveStatus = async (userId, isActive, expectedRole) => {
    const user = await User.findOne({ _id: userId, role: expectedRole });

    if (!user) {
        throw new Error(`${expectedRole} not found`);
    }

    user.isActive = isActive;
    await user.save();

    return user;
};

module.exports = {
    getDashboardStats,
    getAnalytics,
    getAdminJobs,
    getAdminJobById,
    updateJobStatus,
    getUsersByRole,
    updateUserActiveStatus,
};
