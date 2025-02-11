import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute; 