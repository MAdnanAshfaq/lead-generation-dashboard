import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Fade,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Dashboard as DashboardIcon, People as PeopleIcon, Settings as SettingsIcon } from '@mui/icons-material';
import TargetAssignment from './TargetAssignment';
import Sidebar from '../../components/Sidebar';

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeProfiles: 0,
        monthlyTargets: 0,
        completedTargets: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/dashboard/manager/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setStats(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch dashboard statistics');
            console.error('Error fetching dashboard stats:', err);
        }
        setLoading(false);
    };

    const assignTarget = async (targetData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/targets', targetData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Target assigned:', response.data);
            setError('');
        } catch (err) {
            setError('Failed to assign target');
            console.error('Error assigning target:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        const exampleTarget = {
            userId: 'employeeId',
            type: 'daily',
            startDate: '2025-01-16',
            endDate: '2025-01-16',
            targets: { jobsFetched: 5, jobsApplied: 3 },
            profileWiseData: []
        };
        assignTarget(exampleTarget);
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    const AnimatedBox = ({ children }) => (
        <Fade in timeout={1000}>
            <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                {children}
            </Box>
        </Fade>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <AnimatedBox>
                    <Typography variant="h4" gutterBottom>Manager Dashboard</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Total Employees</Typography>
                                    <Typography variant="body1">{stats.totalEmployees}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Active Profiles</Typography>
                                    <Typography variant="body1">{stats.activeProfiles}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Monthly Targets</Typography>
                                    <Typography variant="body1">{stats.monthlyTargets}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Completed Targets</Typography>
                                    <Typography variant="body1">{stats.completedTargets}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card sx={{ overflow: 'visible', height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6">Manage Targets and Profiles</Typography>
                                    <TargetAssignment />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </AnimatedBox>
            </Box>
        </Box>
    );
};

export default ManagerDashboard;
