import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Grid,
    Alert,
    CircularProgress,
    Fade,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar
} from '@mui/material';
import api from '../../utils/axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { Dashboard as DashboardIcon, People as PeopleIcon, Settings as SettingsIcon } from '@mui/icons-material';

const TargetAssignment = () => {
    const user = useSelector(selectUser);
    const [profiles, setProfiles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        profileId: '',
        userId: '',
        month: '',
        year: new Date().getFullYear(),
        targetAmount: ''
    });

    // Fetch profiles and employees on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profilesRes, employeesRes] = await Promise.all([
                    api.get('/api/profiles'),
                    api.get('/users/employees')
                ]);

                setProfiles(profilesRes.data);
                setEmployees(employeesRes.data);
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
                console.error('Error fetching data:', err);
            }
            setLoading(false);
        };

        if (user?.token) {
            fetchData();
        }
    }, [user]);

    const handleAssignProfile = async () => {
        try {
            setError('');
            setSuccess('');
            
            // First assign the profile to the employee if not already assigned
            const profile = profiles.find(p => p._id === formData.profileId);
            const isAssigned = profile?.assignments?.some(
                a => a.employee._id === formData.userId
            );

            if (!isAssigned) {
                await api.post('/api/profiles/assign', {
                    profileId: formData.profileId,
                    userId: formData.userId
                });
            }

            // Then add the target
            await api.post(`/api/profiles/${formData.profileId}/targets`, {
                userId: formData.userId,
                month: formData.month,
                year: formData.year,
                targetAmount: formData.targetAmount
            });

            setSuccess('Target assigned successfully!');
            
            // Refresh profiles list
            const { data } = await api.get('/api/profiles');
            setProfiles(data);

            // Reset form
            setFormData({
                ...formData,
                month: '',
                targetAmount: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign target. Please try again.');
            console.error('Error assigning target:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAssignProfile();
    };

    const AnimatedBox = ({ children }) => (
        <Fade in timeout={1000}>
            <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                {children}
            </Box>
        </Fade>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#1d1d1d' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button key="Dashboard">
                            <ListItemIcon>
                                <DashboardIcon sx={{ color: '#90caf9' }} />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" sx={{ color: '#ffffff' }} />
                        </ListItem>
                        <ListItem button key="Users">
                            <ListItemIcon>
                                <PeopleIcon sx={{ color: '#90caf9' }} />
                            </ListItemIcon>
                            <ListItemText primary="Users" sx={{ color: '#ffffff' }} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key="Settings">
                            <ListItemIcon>
                                <SettingsIcon sx={{ color: '#90caf9' }} />
                            </ListItemIcon>
                            <ListItemText primary="Settings" sx={{ color: '#ffffff' }} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <AnimatedBox>
                    <Typography variant="h4" gutterBottom>Target Assignment</Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Profile</InputLabel>
                                <Select
                                    name="profileId"
                                    value={formData.profileId}
                                    onChange={handleChange}
                                    label="Profile"
                                >
                                    {profiles.map((profile) => (
                                        <MenuItem key={profile._id} value={profile._id}>{profile.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Employee</InputLabel>
                                <Select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    label="Employee"
                                >
                                    {employees.map((employee) => (
                                        <MenuItem key={employee._id} value={employee._id}>{employee.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth required>
                                <InputLabel>Month</InputLabel>
                                <Select
                                    name="month"
                                    value={formData.month}
                                    onChange={handleChange}
                                    label="Month"
                                >
                                    {[
                                        'January', 'February', 'March', 'April',
                                        'May', 'June', 'July', 'August',
                                        'September', 'October', 'November', 'December'
                                    ].map((month) => (
                                        <MenuItem key={month} value={month}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Year"
                                type="number"
                                fullWidth
                                value={formData.year}
                                onChange={handleChange}
                                inputProps={{ min: 2024 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Target Amount"
                                type="number"
                                fullWidth
                                value={formData.targetAmount}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={handleSubmit}
                                disabled={!formData.profileId || !formData.userId || !formData.month || !formData.targetAmount}
                            >
                                Assign Target
                            </Button>
                        </Grid>
                    </Grid>
                </AnimatedBox>

                {/* Display Current Assignments */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Current Assignments
                    </Typography>
                    {profiles.map((profile) => (
                        <Paper key={profile._id} elevation={1} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {profile.name}
                            </Typography>
                            {profile.assignments?.length > 0 ? (
                                profile.assignments.map((assignment) => (
                                    <Box key={assignment._id} ml={2} mt={1}>
                                        <Typography variant="body1">
                                            Employee: {assignment.employee.name}
                                        </Typography>
                                        {assignment.targets.map((target) => (
                                            <Box key={target._id} ml={2} mt={0.5}>
                                                <Typography variant="body2" color="textSecondary">
                                                    {target.month} {target.year}: {target.targetAmount} (Status: {target.status})
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No assignments yet
                                </Typography>
                            )}
                        </Paper>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default TargetAssignment;
