import axiosInstance from './axios';

export const getAllJobs = async () => {
    const response = await axiosInstance.get('/jobs');

    return response.data;
};

export const getJobById = async (jobId) => {
    const response = await axiosInstance.get(`/jobs/${jobId}`);

    return response.data;
};

export const createJob = async (data) => {
    const response = await axiosInstance.post('/jobs', data);

    return response.data;
};

export const getRecruiterJobs = async () => {
    const response = await axiosInstance.get('/recruiter/jobs');

    return response.data;
};

export const getRecruiterDashboard = async () => {
    const response = await axiosInstance.get('/recruiter/dashboard');
    return response.data;
};
