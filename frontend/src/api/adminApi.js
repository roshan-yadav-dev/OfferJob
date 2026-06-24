import axios from './axios';

export const getAdminDashboard = async () => {
    const { data } = await axios.get('/admin/dashboard');
    return data;
};

export const getAdminAnalytics = async () => {
    const { data } = await axios.get('/admin/analytics');
    return data;
};

export const getAdminJobs = async (params = {}) => {
    const { data } = await axios.get('/admin/jobs', { params });
    return data;
};

export const getAdminJobById = async (jobId) => {
    const { data } = await axios.get(`/admin/jobs/${jobId}`);
    return data;
};

export const updateAdminJobStatus = async (jobId, status) => {
    const { data } = await axios.patch(`/admin/jobs/${jobId}/status`, {
        status,
    });
    return data;
};

export const getAdminRecruiters = async (params = {}) => {
    const { data } = await axios.get('/admin/recruiters', { params });
    return data;
};

export const updateRecruiterStatus = async (recruiterId, isActive) => {
    const { data } = await axios.patch(
        `/admin/recruiters/${recruiterId}/status`,
        { isActive },
    );
    return data;
};

export const getAdminStudents = async (params = {}) => {
    const { data } = await axios.get('/admin/students', { params });
    return data;
};

export const updateStudentStatus = async (studentId, isActive) => {
    const { data } = await axios.patch(`/admin/students/${studentId}/status`, {
        isActive,
    });
    return data;
};
