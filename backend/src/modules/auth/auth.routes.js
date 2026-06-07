const express = require('express');

const protect = require('../../middleware/authMiddleware');

const {
    registerValidation,
    validate,
} = require('../../validators/auth.validator');

const { register, login, getMe, getProfile, updateProfile } = require('./auth.controller');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.get('/me', protect, getMe);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);

router.post('/login', login);

module.exports = router;
