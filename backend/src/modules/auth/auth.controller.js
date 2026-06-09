const asyncHandler = require('../../utils/asyncHandler');
const generateToken = require('../../utils/generateToken');

const { registerUser, loginUser } = require('./auth.service');
const { updateUserProfile, getUserProfile } = require('../users/user.service');

// Register Controller
const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                resumeUrl: user.resumeUrl,
                resumePublicId: user.resumePublicId,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                resumeUrl: user.resumeUrl,
                resumePublicId: user.resumePublicId,
                mobileNumber: user.mobileNumber,
                city: user.city,
                state: user.state,
                collegeName: user.collegeName,
                currentCGPA: user.currentCGPA,
                currentSemester: user.currentSemester,
                passoutYear: user.passoutYear,
                companyName: user.companyName,
                currentPosition: user.currentPosition,
                address: user.address,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
};

// Get User Profile
const getProfile = asyncHandler(async (req, res) => {
    const profile = await getUserProfile(req.user._id);

    res.status(200).json({
        success: true,
        profile,
    });
});

// Update User Profile
const updateProfile = asyncHandler(async (req, res) => {
    const profile = await updateUserProfile(req.user._id, req.body);

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: profile,
    });
});

module.exports = {
    register,
    login,
    getMe,
    getProfile,
    updateProfile,
};
