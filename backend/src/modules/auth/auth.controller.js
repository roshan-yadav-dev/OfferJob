const generateToken = require('../../utils/generateToken');

const { registerUser, loginUser } = require('./auth.service');

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

module.exports = {
    register,
    login,
    getMe,
};
