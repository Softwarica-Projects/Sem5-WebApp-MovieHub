import axios from '../config/axiosConfig';

// Create a new genre
export const createGenre = async (genreData) => {
    const response = await axios.post('/genres', genreData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Get all genres
export const getGenres = async () => {
    const response = await axios.get('/genres');
    return response.data;
};

// Get a genre by ID
export const getGenreById = async (id) => {
    const response = await axios.get(`/genres/${id}`);
    return response.data;
};

// Update a genre
export const updateGenre = async (id, genreData) => {
    const response = await axios.put(`/genres/${id}`, genreData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete a genre
export const deleteGenre = async (id) => {
    const response = await axios.delete(`/genres/${id}`);
    return response.data;
};