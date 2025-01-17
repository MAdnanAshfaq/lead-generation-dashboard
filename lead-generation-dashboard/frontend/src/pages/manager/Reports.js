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
import { saveAs } from 'file-saver';
import { Dashboard as DashboardIcon, People as PeopleIcon, Settings as SettingsIcon } from '@mui/icons-material';

const Reports = () => {
    const [reports, setReports] = useState({
        totalEmployees: 0,
        activeProfiles: 0,
        completedTargets: 0,
        pendingTargets: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/reports/manager/summary');
            setReports(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch reports');
            console.error('Error fetching reports:', err);
        }
        setLoading(false);
    };

    const downloadReport = async () => {
        try {
            const response = await axios.get('/reports/manager/download', {
                responseType: 'blob',
            });
            saveAs(response.data, 'report.docx');
        } catch (err) {
            setError('Failed to download report');
            console.error('Error downloading report:', err);
        }
    };

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
                    <Typography variant="h4" gutterBottom>Manager Reports</Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Total Employees</Typography>
                                    <Typography variant="body1">{reports.totalEmployees}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Active Profiles</Typography>
                                    <Typography variant="body1">{reports.activeProfiles}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Completed Targets</Typography>
                                    <Typography variant="body1">{reports.completedTargets}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Pending Targets</Typography>
                                    <Typography variant="body1">{reports.pendingTargets}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={downloadReport}>
                            Download Report
                        </Button>
                    </Box>
                </AnimatedBox>
            </Box>
        </Box>
    );
};

export default Reports;
