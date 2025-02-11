import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            // First check if server is running
            await axiosInstance.get('/health');

            // Then fetch dashboard data
            const [statsResponse, usersResponse] = await Promise.all([
                axiosInstance.get('/dashboard/admin/stats'),
                axiosInstance.get('/users/all')
            ]);

            setStats(statsResponse.data.data.stats);
            setUsers(usersResponse.data.data);
        } catch (error) {
            console.error('Dashboard Error:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            setLoading(true);
            await axiosInstance.put(`/users/${userId}/status`, { status: newStatus });
            
            await fetchDashboardData();
            
            console.log(`User status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating user status:', error);
            setError('Failed to update user status');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={fetchDashboardData}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats?.users?.total || 0}</p>
                    <div className="stat-breakdown">
                        <span>Managers: {stats?.users?.managers || 0}</span>
                        <span>Employees: {stats?.users?.employees || 0}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Profiles</h3>
                    <p className="stat-number">{stats?.profiles?.total || 0}</p>
                    <div className="stat-breakdown">
                        <span>Active: {stats?.profiles?.active || 0}</span>
                        <span>Inactive: {stats?.profiles?.inactive || 0}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Targets</h3>
                    <p className="stat-number">{stats?.targets?.total || 0}</p>
                    <div className="stat-breakdown">
                        <span>Completed: {stats?.targets?.completed || 0}</span>
                        <span>Pending: {stats?.targets?.pending || 0}</span>
                    </div>
                </div>
            </div>

            {/* User Management Section */}
            <div className="user-management-section">
                <div className="section-header">
                    <h2>User Management</h2>
                    <button 
                        className="create-user-btn"
                        onClick={() => navigate('/admin/users/create')}
                    >
                        Create New User
                    </button>
                </div>

                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.status}</td>
                                    <td>
                                        <button 
                                            className="edit-btn"
                                            onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="status-btn"
                                            onClick={() => handleStatusChange(user._id, user.status === 'active' ? 'inactive' : 'active')}
                                        >
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
