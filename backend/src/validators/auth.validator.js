const { body, validationResult } = require('express-validator');

// Register Validation Rules
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),

    body('email').isEmail().withMessage('Valid email required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars'),
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email required'),
];

const resetPasswordValidation = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars'),
];

// Validation Middleware - Convert errors to object format
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Convert array of errors to object format for consistency
        const errorObj = {};
        errors.array().forEach((err) => {
            errorObj[err.param] = err.msg;
        });

        return res.status(400).json({
            success: false,
            errors: errorObj,
        });
    }

    next();
};

module.exports = {
    registerValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    validate,
};
