import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddMoviePage from './pages/admin/AddMoviePage';
import MoviesManagement from './pages/admin/MoviesManagement';
import GenresManagement from './pages/admin/GenresManagement';
import AdminsManagement from './pages/admin/AdminsManagement';
import ProtectedRoute from './components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/movies"
                        element={
                            <ProtectedRoute role="admin">
                                <MoviesManagement />
                            </ProtectedRoute>
                        }
                    />
                     <Route
                        path="/admin/movies/create"
                        element={
                            <ProtectedRoute role="admin">
                                <AddMoviePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/movies/update/:id"
                        element={
                            <ProtectedRoute role="admin">
                                <AddMoviePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/genres"
                        element={
                            <ProtectedRoute role="admin">
                                <GenresManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/user-list"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminsManagement />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;