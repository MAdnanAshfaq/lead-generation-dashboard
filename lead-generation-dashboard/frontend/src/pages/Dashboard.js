import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="dashboard">
            <header>
                <h1>Lead Generation Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.name || 'User'}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>
            <main>
                <h2>Dashboard Content</h2>
                <p>Welcome to your dashboard!</p>
            </main>
        </div>
    );
};

export default Dashboard;
