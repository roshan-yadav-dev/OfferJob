const User = require('./user.model');

const updateUserProfile = async (userId, profileData) => {
    const allowedFields = [
        'name',
        'email',
        'mobileNumber',
        'city',
        'state',
        'collegeName',
        'currentCGPA',
        'currentSemester',
        'passoutYear',
        'companyName',
        'currentPosition',
        'address',
        'resumeUrl',
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
        if (field in profileData) {
            updateData[field] = profileData[field];
        }
    });

    if (Object.keys(updateData).length === 0) {
        throw new Error('No valid fields to update');
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

module.exports = {
    updateUserProfile,
    getUserProfile,
};
