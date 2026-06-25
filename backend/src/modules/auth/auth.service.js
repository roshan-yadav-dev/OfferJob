const User = require('../users/user.model');
const crypto = require('crypto');

// Register User
const registerUser = async (userData) => {
    const existingUser = await User.findOne({
        email: userData.email,
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    if (userData.role === 'admin') {
        throw new Error('Invalid registration role');
    }

    const user = await User.create({
        ...userData,
        isActive: true,
    });

    return user;
};

// Login User
// Login User
const loginUser = async (email, password) => {
    // Super Admin Login
    if (email === process.env.ADMIN_EMAIL) {
        if (password !== process.env.ADMIN_PASSWORD) {
            throw new Error('Invalid credentials');
        }

        return {
            _id: 'admin',
            name: 'Administrator',
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
            isActive: true,
        };
    }

    // Normal User Login
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    if (user.isActive === false) {
        throw new Error('Your account has been suspended. Contact support.');
    }

    return user;
};
const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        return null;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    return { user, resetToken };
};

const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return user;
};

module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword,
};
