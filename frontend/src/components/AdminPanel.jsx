import React, { useEffect, useState } from 'react';
import { getMovies, deleteMovie } from '../services/movieService';

const AdminPanel = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const data = await getMovies();
            setMovies(data);
        };
        fetchMovies();
    }, []);

    const handleDelete = async (id) => {
        await deleteMovie(id);
        setMovies(movies.filter(movie => movie._id !== id));
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(movie => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>
                                <button onClick={() => handleDelete(movie._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {/* Logic to add a new movie */}}>Add Movie</button>
        </div>
    );
};

export default AdminPanel;