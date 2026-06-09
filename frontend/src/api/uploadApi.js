import axiosInstance from './axios';

/**
 * Upload resume to backend
 * Backend handles Cloudinary upload and stores metadata
 * @param {FormData} formData - FormData containing the resume file
 * @param {Function} onUploadProgress - Callback for upload progress
 * @returns {Promise<Object>} - Response with resumeUrl and resumePublicId
 */
export const uploadResume = async (formData, onUploadProgress) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axiosInstance.post('/upload/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Upload failed');
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export default uploadResume;
