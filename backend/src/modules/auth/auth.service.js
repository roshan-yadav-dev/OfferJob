const User = require('../users/user.model');

// Register User
const registerUser = async (userData) => {
    const existingUser = await User.findOne({
        email: userData.email,
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const user = await User.create(userData);

    return user;
};

// Login User
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
};

module.exports = {
    registerUser,
    loginUser,
};
