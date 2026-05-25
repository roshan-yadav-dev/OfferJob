import axiosInstance from './axios';

export const loginUser = async (data) => {
    const response = await axiosInstance.post('/auth/login', data);

    return response.data;
};

export const signupUser = async (data) => {
    const response = await axiosInstance.post('/auth/register', data);

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/auth/me');

    return response.data;
};
