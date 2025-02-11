import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const { isAuthenticated, user, token } = useAuth();

    useEffect(() => {
        // Check authentication and role
        if (!isAuthenticated || !user || user.role !== 'MANAGER') {
            navigate('/login');
            return;
        }

        // Fetch dashboard stats
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/dashboard/manager/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError(err.message);
            }
        };

        fetchStats();
    }, [isAuthenticated, user, token, navigate]);

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div className="manager-dashboard">
            <h1>Manager Dashboard</h1>
            {/* Rest of your dashboard UI */}
        </div>
    );
};

export default ManagerDashboard; 