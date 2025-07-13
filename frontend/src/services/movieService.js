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
    const response = await axios.get('/movies/search');
    return response.data;
};

export const getMovieById = async (id) => {
    const response = await axios.get(`/movies/${id}/detail`);
    return response.data;
};

export const updateMovie = async (id, movieData) => {
    const response = await axios.put(`/movies/${id}`, movieData, {
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

export const getFeaturedMovies = async () => {
    const response = await axios.get('/movies/featured-movies');
    return response.data;
};

export const getRecentlyAdded = async () => {
    const response = await axios.get('/movies/recent');
    return response.data;
};
export const getPopularMovies = async () => {
    const response = await axios.get('/movies/top-viewed');
    return response.data;
};export const getReleasingSoonMovies = async () => {
    const response = await axios.get('/movies/soon-releasing');
    return response.data;
};

export const searchMovies = async (searchTerm = '', genreId = '', sortBy = '', orderBy = '') => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('query', searchTerm);
    if (genreId) params.append('genreId', genreId);
    if (sortBy) params.append('sortBy', sortBy);
    if (orderBy) params.append('orderBy', orderBy);
    
    const response = await axios.get(`/movies/search?${params.toString()}`);
    return response.data;
};
