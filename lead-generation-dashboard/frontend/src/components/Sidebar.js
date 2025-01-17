// Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, People as PeopleIcon, Assignment as AssignmentIcon, BarChart as BarChartIcon } from '@mui/icons-material';

const Sidebar = () => {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className="sidebar">
            <h2>Manager User</h2>
            <button onClick={() => navigateTo('/dashboard')}><DashboardIcon /> Dashboard</button>
            <button onClick={() => navigateTo('/employees')}><PeopleIcon /> Employees</button>
            <button onClick={() => navigateTo('/target-assignment')}><AssignmentIcon /> Target Assignment</button>
            <button onClick={() => navigateTo('/reports')}><BarChartIcon /> Reports</button>
        </div>
    );
};

export default Sidebar;