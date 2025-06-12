import axios from '../config/axiosConfig';

// User registration
export const registerUser = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};
