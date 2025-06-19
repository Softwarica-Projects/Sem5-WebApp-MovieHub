import axios from '../config/axiosConfig';
// Create a new movie
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
//   Get all movies
export const getMovies = async () => {
    const response = await axios.get('/movies');
    return response.data;
};
// Get a movie by ID
export const getMovieById = async (id) => {
    const response = await axios.get(`/movies/${id}`);
    return response.data;
};
// Update a movie
export const updateMovie = async (id, movieData) => {
    const response = await axios.put(`/movies/${id}`, movieData,  {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    return response.data;
};
// Delete a movie
export const deleteMovie = async (id) => {
    const response = await axios.delete(`/movies/${id}`);
    return response.data;
};

// Toggle featured status of a movie
export const toggleFeatured = async (id) => {
    const response = await axios.patch(`/movies/${id}/featured`);
    return response.data;
};