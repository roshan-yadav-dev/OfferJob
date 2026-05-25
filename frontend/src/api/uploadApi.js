import axiosInstance from './axios';

export const uploadResume = async (formData, onUploadProgress) => {
    const response = await axiosInstance.post('/upload/resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },

        onUploadProgress,
    });

    return response.data;
};
