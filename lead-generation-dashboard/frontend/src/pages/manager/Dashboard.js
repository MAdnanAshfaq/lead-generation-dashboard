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
    Toolbar,
    Button
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Dashboard as DashboardIcon, People as PeopleIcon, Settings as SettingsIcon, LogoutRounded as LogoutIcon } from '@mui/icons-material';
import TargetAssignment from './TargetAssignment';
import Sidebar from '../../components/Sidebar';
import dashboardService from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import CyberDialog from '../../components/CyberDialog';
import '../../styles/Dashboard.css';
import axiosInstance from '../../utils/axiosConfig';
import '../../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated, token } = useSelector(state => state.auth);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeStats, setEmployeeStats] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    console.log('Dashboard Mount:', {
        isAuthenticated,
        user,
        token: token ? 'exists' : 'missing',
        localStorage: {
            token: localStorage.getItem('token') ? 'exists' : 'missing',
            user: localStorage.getItem('user')
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/dashboard/manager/stats');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching manager dashboard data:', err);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axiosInstance.get('/manager/employees');
            setEmployees(response.data.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching employees');
            setLoading(false);
        }
    };

    const fetchEmployeeStats = async (employeeId) => {
        try {
            const response = await axiosInstance.get(`/manager/employee/${employeeId}/stats`, {
                params: dateRange
            });
            setEmployeeStats(response.data.data);
        } catch (error) {
            setError('Error fetching employee statistics');
        }
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        fetchEmployeeStats(employee._id);
    };

    const handleDateRangeChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
        if (selectedEmployee) {
            fetchEmployeeStats(selectedEmployee._id);
        }
    };

    const testProfiles = async () => {
        try {
            const data = await dashboardService.testProfiles();
            console.log('Test Profiles Result:', data);
        } catch (err) {
            console.error('Error testing profiles:', err);
        }
    };

    const assignTarget = async (employeeId) => {
        try {
            const targetData = {
                employeeId: employeeId, // This should be a valid MongoDB ObjectId
                type: 'daily',
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                targets: {
                    jobsFetched: 5,
                    jobsApplied: 3
                },
                profileWiseData: [],
                createdBy: user.id // Add the manager's ID as creator
            };

            console.log('Assigning target:', targetData);

            const response = await axiosInstance.post('/targets', targetData);
            
            console.log('Target assigned:', response.data);
            return response.data;
        } catch (err) {
            console.error('Error assigning target:', {
                status: err.response?.status,
                message: err.response?.data?.message,
                error: err.message
            });
            throw err;
        }
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false);
        dispatch(logout());
        navigate('/login');
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    console.log('Dashboard Render:', {
        isAuthenticated,
        user,
        hasStats: !!data,
        error
    });

    // If not authenticated, don't show error, just redirect
    if (!isAuthenticated || !user || user.role !== 'MANAGER') {
        console.log('Not authenticated or not manager, redirecting...');
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">
                    Loading dashboard data...
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="dashboard-container">
                <div className="loading">
                    <p>Retrying data load...</p>
                    <button 
                        onClick={() => {
                            setLoading(true);
                            window.location.reload();
                        }} 
                        className="retry-button"
                    >
                        Retry Now
                    </button>
                </div>
            </div>
        );
    }

    const AnimatedBox = ({ children }) => (
        <Fade in timeout={1000}>
            <Box sx={{ 
                p: 3, 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                borderRadius: 2, 
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                border: '1px solid #00ff00'
            }}>
                {children}
            </Box>
        </Fade>
    );

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <AnimatedBox>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" gutterBottom sx={{ color: '#00ff00', mb: 0 }}>
                            Manager Dashboard
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogoutClick}
                            sx={{
                                color: '#00ff00',
                                borderColor: '#00ff00',
                                '&:hover': {
                                    borderColor: '#00ff00',
                                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                                },
                                textTransform: 'none',
                                fontFamily: 'Orbitron, sans-serif'
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid #00ff00',
                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#00ff00' }}>
                                        Total Employees
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        {data.totalEmployees}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid #00ff00',
                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#00ff00' }}>
                                        Active Profiles
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        {data.activeProfiles}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid #00ff00',
                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#00ff00' }}>
                                        Monthly Targets
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        {data.monthlyTargets}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid #00ff00',
                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#00ff00' }}>
                                        Completed Targets
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        {data.completedTargets}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card sx={{ 
                                overflow: 'visible', 
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid #00ff00',
                                boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#00ff00' }}>
                                        Manage Targets and Profiles
                                    </Typography>
                                    <TargetAssignment />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </AnimatedBox>
            </Box>

            <CyberDialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                content="Are you sure you want to terminate your session?"
            />
        </Box>
    );
};

export default ManagerDashboard;
