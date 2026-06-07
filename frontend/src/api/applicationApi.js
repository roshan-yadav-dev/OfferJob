import axiosInstance from './axios';

// Apply to a job
export const applyToJob = async (jobId, resumeUrl) => {
    const { data } = await axiosInstance.post('/applications/apply', {
        jobId,
        resumeUrl: resumeUrl || localStorage.getItem('resumeUrl'),
    });

    return data;
};

// Get pre-application AI match score
export const getPreApplicationScore = async (jobId) => {
    const { data } = await axiosInstance.post(
        '/applications/pre-application-score',
        {
            jobId,
        },
    );

    return data;
};

// Get all applications
export const getApplications = async () => {
    const { data } = await axiosInstance.get('/applications');

    return data;
};

// Get logged-in student applications
export const getMyApplications = async () => {
    const { data } = await axiosInstance.get('/applications/my-applications');

    return data;
};

// Get applicants for a specific job (Recruiter)
export const getJobApplicants = async (jobId) => {
    const { data } = await axiosInstance.get(
        `/recruiter/jobs/${jobId}/applications`,
    );

    return data;
};

// Update application status (Recruiter)
export const updateApplicationStatus = async (applicationId, status) => {
    const { data } = await axiosInstance.patch(
        `/recruiter/applications/${applicationId}/status`,
        { status },
    );

    return data;
};

// Get student dashboard stats
export const getStudentDashboard = async () => {
    const { data } = await axiosInstance.get('/applications/student/dashboard');

    return data;
};
