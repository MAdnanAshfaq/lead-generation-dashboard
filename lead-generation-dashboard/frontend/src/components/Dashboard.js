import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const { isAuthenticated, user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!isAuthenticated || !user) {
            console.log('Not authenticated, redirecting to login');
            navigate('/login');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Fetching stats...');
            const response = await fetch('http://localhost:3001/api/dashboard/manager/stats', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.status === 401) {
                console.log('Unauthorized, redirecting to login');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received stats:', data);
            setStats(data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError(
                err.message === 'Failed to fetch' 
                    ? 'Cannot connect to server. Please ensure the backend is running.'
                    : err.message || 'Failed to load dashboard data'
            );
            setStats(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleRetry = (e) => {
        e.preventDefault();
        console.log('Retrying fetch...');
        fetchStats();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="cyber-loading">
                    <div className="cyber-spinner"></div>
                    <p>INITIALIZING DASHBOARD...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="cyber-error">
                    <h2>SYSTEM ERROR</h2>
                    <p>{error}</p>
                    <button className="cyber-button" onClick={fetchStats}>
                        REINITIALIZE
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <nav className="cyber-nav">
                <h1>LEAD<span className="highlight">GEN</span>DASHBOARD</h1>
                <div className="user-info">
                    <span>{user?.email}</span>
                    <button className="cyber-button small" onClick={handleLogout}>
                        DISCONNECT
                    </button>
                </div>
            </nav>

            <div className="stats-grid">
                <div className="cyber-card">
                    <h3>TOTAL EMPLOYEES</h3>
                    <div className="stat-value">{stats?.totalEmployees || 0}</div>
                    <div className="cyber-card-decoration"></div>
                </div>

                <div className="cyber-card">
                    <h3>ACTIVE PROFILES</h3>
                    <div className="stat-value">{stats?.activeProfiles || 0}</div>
                    <div className="cyber-card-decoration"></div>
                </div>

                <div className="cyber-card">
                    <h3>TOTAL LEADS</h3>
                    <div className="stat-value">{stats?.totalLeads || 0}</div>
                    <div className="cyber-card-decoration"></div>
                </div>
            </div>

            {/* Floating objects for cyberpunk effect */}
            <div className="floating-objects">
                {Array(10).fill(null).map((_, index) => (
                    <div
                        key={`float-${index}`}
                        className={`float-item ${['circle', 'triangle', 'square'][index % 3]}`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard; 