const express = require('express');

const upload = require('../middleware/uploadMiddleware');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Resume Upload Route
router.post('/resume', protect, upload.single('resume'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            fileUrl: `/uploads/resumes/${req.file.filename}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
