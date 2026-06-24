const express = require('express');

const protect = require('../../middleware/authMiddleware');

const {
    registerValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    validate,
} = require('../../validators/auth.validator');

const {
    register,
    login,
    getMe,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPasswordController,
} = require('./auth.controller');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.get('/me', protect, getMe);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);

router.post('/login', login);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, validate, resetPasswordController);

module.exports = router;
