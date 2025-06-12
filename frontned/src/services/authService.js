import axios from '../config/axiosConfig';

// User registration
export const registerUser = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};
// User login
export const loginUser = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
};

// Admin login
export const loginAdmin = async (credentials) => {
    const response = await axios.post('/auth/admin/login', credentials); // Adjust endpoint as per backend
    return response.data;
};