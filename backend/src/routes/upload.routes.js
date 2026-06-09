const express = require('express');

const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');
const User = require('../modules/users/user.model');
const { uploadResume } = require('../services/resumeUploadService');

const router = express.Router();

// Resume Upload Route
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // Upload resume to Cloudinary
        const uploadResult = await uploadResume(
            req.file.buffer,
            req.file.originalname,
        );

        // Persist resumeUrl and resumePublicId to authenticated user's document
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                resumeUrl: uploadResult.secure_url,
                resumePublicId: uploadResult.public_id,
            },
            { new: true, runValidators: true },
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resumeUrl: uploadResult.secure_url,
            resumePublicId: uploadResult.public_id,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
