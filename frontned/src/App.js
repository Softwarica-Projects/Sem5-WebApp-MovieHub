import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddMoviePage from './pages/admin/AddMoviePage';
import MoviesManagement from './pages/admin/MoviesManagement';
import GenresManagement from './pages/admin/GenresManagement';
import AdminsManagement from './pages/admin/AdminsManagement';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
           <p>This is Home Page</p>
        </>
    );
}

export default App;