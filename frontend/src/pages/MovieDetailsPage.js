import React, { useEffect, useState } from 'react';
import { getMovieById } from '../services/movieService';
import { useParams } from 'react-router-dom';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getMovieById(id);
                setMovie(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch movie details');
            }
        };
        fetchMovie();
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!movie) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <p>Genre: {movie.genre}</p>
            <p>Runtime: {movie.runtime} minutes</p>
        </div>
    );
};

export default MovieDetailsPage;