import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                navigate('/login', { replace: true });
            } catch (error) {
                console.error('Logout error:', error);
                // Force redirect to login even if logout fails
                window.location.href = '/login';
            }
        };

        performLogout();
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout; 