import axios from '../config/axiosConfig';

export const createMovie = async (movieData) => {
    const response = await axios.post('/movies', movieData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};

export const getMovies = async () => {
    const response = await axios.get('/movies');
    return response.data;
};

export const getMovieById = async (id) => {
    const response = await axios.get(`/movies/${id}`);
    return response.data;
};

export const updateMovie = async (id, movieData) => {
    const response = await axios.put(`/movies/${id}`, movieData,  {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    return response.data;
};

export const deleteMovie = async (id) => {
    const response = await axios.delete(`/movies/${id}`);
    return response.data;
};

export const toggleFeatured = async (id) => {
    const response = await axios.patch(`/movies/${id}/featured`);
    return response.data;
};