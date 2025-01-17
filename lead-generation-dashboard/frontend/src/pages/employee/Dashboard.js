import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Dashboard as DashboardIcon, People as PeopleIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import StatsSummary from '../../components/stats/StatsSummary';
import PerformanceChart from '../../components/charts/PerformanceChart';
import {
    fetchEmployeeTargets,
    addDailyAchievement,
    selectTargets,
    selectTargetLoading,
} from '../../store/slices/targetSlice';
import { selectUser } from '../../store/slices/authSlice';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { SphereGeometry, Mesh } from 'three';

const UpdateDialog = ({ open, onClose, onSubmit, profiles, loading }) => {
    const [values, setValues] = useState({
        profile: '',
        jobsFetched: 0,
        jobsApplied: 0,
    });

    const handleSubmit = () => {
        onSubmit(values);
        setValues({ profile: '', jobsFetched: 0, jobsApplied: 0 });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Daily Achievement</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    fullWidth
                    label="Profile"
                    value={values.profile}
                    onChange={(e) => setValues({ ...values, profile: e.target.value })}
                    margin="normal"
                >
                    {profiles.map((profile) => (
                        <MenuItem key={profile._id} value={profile._id}>
                            {profile.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    type="number"
                    label="Jobs Fetched"
                    value={values.jobsFetched}
                    onChange={(e) => setValues({ ...values, jobsFetched: parseInt(e.target.value) })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Jobs Applied"
                    value={values.jobsApplied}
                    onChange={(e) => setValues({ ...values, jobsApplied: parseInt(e.target.value) })}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !values.profile}
                >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const EmployeeDashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const targets = useSelector(selectTargets);
    const loading = useSelector(selectTargetLoading);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const today = new Date();
            dispatch(fetchEmployeeTargets({
                userId: user._id,
                startDate: format(today, 'yyyy-MM-dd'),
                endDate: format(today, 'yyyy-MM-dd'),
                type: 'daily'
            }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            const today = new Date();
            dispatch(fetchEmployeeTargets({
                userId: user._id,
                startDate: format(today, 'yyyy-MM-dd'),
                endDate: format(today, 'yyyy-MM-dd'),
                type: 'daily'
            }));
        }
    }, [dispatch, user]);

    const currentTarget = targets[0] || {
        targets: { jobsFetched: 0, jobsApplied: 0 },
        achievements: { jobsFetched: 0, jobsApplied: 0 }
    };

    const stats = [
        {
            title: 'Jobs Fetched Today',
            current: currentTarget.achievements.jobsFetched,
            target: currentTarget.targets.jobsFetched,
            color: 'primary'
        },
        {
            title: 'Jobs Applied Today',
            current: currentTarget.achievements.jobsApplied,
            target: currentTarget.targets.jobsApplied,
            color: 'secondary'
        }
    ];

    const chartData = {
        labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
        datasets: [
            {
                label: 'Jobs Fetched',
                data: [2, 3, 4, 3, 5, 4, 6, 4],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Jobs Applied',
                data: [1, 2, 2, 3, 2, 3, 2, 1],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
        ],
    };

    const handleUpdate = async (values) => {
        if (currentTarget._id) {
            await dispatch(addDailyAchievement({
                targetId: currentTarget._id,
                data: {
                    profile: values.profile,
                    date: new Date(),
                    jobDetails: [
                        {
                            status: 'fetched',
                            count: values.jobsFetched
                        },
                        {
                            status: 'applied',
                            count: values.jobsApplied
                        }
                    ]
                }
            }));
            
            // Refresh targets
            dispatch(fetchEmployeeTargets({
                userId: user._id,
                startDate: format(new Date(), 'yyyy-MM-dd'),
                endDate: format(new Date(), 'yyyy-MM-dd'),
                type: 'daily'
            }));
        }
    };

    if (loading && !targets.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
                    <Canvas>
                        <OrbitControls enableZoom={false} />
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[3, 2, 1]} />
                        <mesh>
                            <sphereGeometry args={[1, 100, 200]} />
                            <MeshDistortMaterial
                                color="#8352FD"
                                attach="material"
                                distort={0.3}
                                speed={1.5}
                            />
                        </mesh>
                    </Canvas>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4">
                        Employee Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setUpdateDialogOpen(true)}
                    >
                        Update Achievement
                    </Button>
                </Box>

                <StatsSummary stats={stats} />

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <PerformanceChart
                            data={chartData}
                            title="Today's Performance"
                            height={300}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Assigned Profiles
                            </Typography>
                            <Grid container spacing={2}>
                                {user?.assignedProfiles?.map((profile) => (
                                    <Grid item xs={12} sm={6} md={3} key={profile._id}>
                                        <Paper
                                            elevation={1}
                                            sx={{ p: 2, textAlign: 'center' }}
                                        >
                                            <Typography variant="h6">
                                                {profile.name}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Active
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

                <UpdateDialog
                    open={updateDialogOpen}
                    onClose={() => setUpdateDialogOpen(false)}
                    onSubmit={handleUpdate}
                    profiles={user?.assignedProfiles || []}
                    loading={loading}
                />
            </Box>
        </Box>
    );
};

export default EmployeeDashboard;
