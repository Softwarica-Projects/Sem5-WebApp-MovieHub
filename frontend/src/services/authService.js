import axios from '../config/axiosConfig';

export const registerUser = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
};

export const loginAdmin = async (credentials) => {
    const response = await axios.post('/auth/admin/login', credentials); 
    return response.data;
};
export const getFavouriteMovies = async () => {
    const response = await axios.get('/auth/favorites');
    return response.data;
};