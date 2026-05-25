const jwt = require('jsonwebtoken');

const User = require('../modules/users/user.model');

const config = require('../config/env');

// Protect Middleware
const protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // No Token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token missing',
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Get User
        req.user = await User.findById(decoded.id).select('-password');

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};

module.exports = protect;
