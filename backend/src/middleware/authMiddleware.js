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

        // Virtual Admin
        if (decoded.id === 'admin') {
            req.user = {
                _id: 'admin',
                name: 'Administrator',
                email: process.env.ADMIN_EMAIL,
                role: 'admin',
                isActive: true,
            };

            return next();
        }

        // Normal User
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};

module.exports = protect;
