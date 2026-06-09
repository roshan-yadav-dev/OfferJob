const cloudinary = require('../config/cloudinary');
const logger = require('../config/logger');

/**
 * Upload a resume file to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} - Object with secure_url and public_id
 */
async function uploadResume(fileBuffer, fileName) {
    try {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'job-service-platform/resumes',
                    resource_type: 'raw',
                    public_id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    overwrite: false,
                    timeout: 60000, // 60 seconds
                },
                (error, result) => {
                    if (error) {
                        logger.error('Resume upload error:', error);
                        reject(
                            new Error(
                                `Failed to upload resume: ${error.message}`,
                            ),
                        );
                    } else {
                        resolve({
                            secure_url: result.secure_url,
                            public_id: result.public_id,
                            format: result.format,
                            size: result.bytes,
                        });
                    }
                },
            );

            stream.end(fileBuffer);
        });
    } catch (error) {
        logger.error('Resume upload service error:', error);
        throw error;
    }
}

/**
 * Delete a resume file from Cloudinary
 * @param {string} publicId - The public ID of the file
 * @returns {Promise<Object>} - Cloudinary deletion response
 */
async function deleteResume(publicId) {
    try {
        if (!publicId) {
            throw new Error('Public ID is required for deletion');
        }

        const result = await cloudinary.uploader.destroy(publicId);
        logger.info(`Resume deleted: ${publicId}`);
        return result;
    } catch (error) {
        logger.error('Resume deletion error:', error);
        throw error;
    }
}

/**
 * Get metadata for a resume file
 * @param {string} publicId - The public ID of the file
 * @returns {Promise<Object>} - Cloudinary resource metadata
 */
async function getResumeMetadata(publicId) {
    try {
        if (!publicId) {
            throw new Error('Public ID is required for metadata retrieval');
        }

        const result = await cloudinary.api.resource(publicId);
        return {
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
            created_at: result.created_at,
        };
    } catch (error) {
        logger.error('Resume metadata retrieval error:', error);
        throw error;
    }
}

/**
 * Get secure URL for a resume by public ID
 * @param {string} publicId - The public ID of the file
 * @returns {string} - Secure URL to the file
 */
function getResumeUrl(publicId) {
    if (!publicId) {
        return null;
    }

    try {
        return cloudinary.url(publicId, {
            secure: true,
            resource_type: 'auto',
        });
    } catch (error) {
        logger.error('Error generating resume URL:', error);
        return null;
    }
}

module.exports = {
    uploadResume,
    deleteResume,
    getResumeMetadata,
    getResumeUrl,
};
