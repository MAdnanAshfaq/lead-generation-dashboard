import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import { hasPermission } from '../../utils/permissions';
import { motion } from 'framer-motion';
import { varFadeIn } from '../animate/variants/fade';

const ProtectedRoute = ({ children, requiredRole, requiredPermissions = [] }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const hasRole = !requiredRole || user.role === requiredRole;
    const hasRequiredPermissions = requiredPermissions.length === 0 || 
        requiredPermissions.every(({ resource, action }) => 
            hasPermission(user.role, resource, action)
        );

    if (!hasRole || !hasRequiredPermissions) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <motion.div
            variants={varFadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
};

export default ProtectedRoute;
