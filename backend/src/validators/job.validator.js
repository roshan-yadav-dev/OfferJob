const { body, validationResult } = require('express-validator');

// Register Validation Rules
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),

    body('email').isEmail().withMessage('Valid email required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars'),
];

// Validation Middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
};

module.exports = {
    registerValidation,
    validate,
};
