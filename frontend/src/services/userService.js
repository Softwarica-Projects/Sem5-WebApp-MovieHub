import axios from '../config/axiosConfig';

export const getUserProfile = async () => {
    const response = await axios.get('/auth/me');
    return response.data;
};

export const updateUserProfile = async (profileData) => {
    const response = await axios.put('/auth/update-profile', profileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await axios.post('/auth/change-password', passwordData);
    return response.data;
};

export const getUserStats = async () => {
    try {
        const response = await axios.get('/auth/stats');
        return response.data;
    } catch (error) {
        return {
            ratedMoviesCount: 0,
            viewedMoviesCount: 0,
            mostViewedMovie: null
        };
    }
};
