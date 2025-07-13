import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (!token || !role.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;