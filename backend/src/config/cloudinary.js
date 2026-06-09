const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
if (
    !cloudinary.config().cloud_name ||
    !cloudinary.config().api_key ||
    !cloudinary.config().api_secret
) {
    logger.warn(
        '⚠️ Cloudinary credentials not fully configured. Check environment variables.',
    );
}

module.exports = cloudinary;
