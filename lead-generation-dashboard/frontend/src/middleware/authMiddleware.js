import { jwtDecode } from 'jwt-decode';
import { logout } from '../store/slices/authSlice';

export const validateToken = () => (next) => (action) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp < currentTime) {
                localStorage.removeItem('token');
                next(logout());
                return;
            }
        } catch (error) {
            localStorage.removeItem('token');
            next(logout());
            return;
        }
    }
    
    return next(action);
};

export const checkPermission = (requiredRole) => {
    return (state) => {
        const { user } = state.auth;
        if (!user) return false;

        switch (requiredRole) {
            case 'admin':
                return user.role === 'admin';
            case 'manager':
                return ['admin', 'manager'].includes(user.role);
            case 'employee':
                return ['admin', 'manager', 'employee'].includes(user.role);
            default:
                return false;
        }
    };
};

export const PermissionError = class extends Error {
    constructor(message = 'Unauthorized access') {
        super(message);
        this.name = 'PermissionError';
    }
};
