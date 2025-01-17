import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    SupervisorAccount as ManagerIcon,
    Person as EmployeeIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
        <CardContent>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Grid>
                <Grid item>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div">
                        {value}
                    </Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    // This would be fetched from the API in a real implementation
    const stats = {
        totalUsers: 25,
        totalProfiles: 4,
        managers: 3,
        employees: 20,
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={PeopleIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Profiles"
                        value={stats.totalProfiles}
                        icon={AssignmentIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Managers"
                        value={stats.managers}
                        icon={ManagerIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Employees"
                        value={stats.employees}
                        icon={EmployeeIcon}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activities
                        </Typography>
                        {/* Activity list would go here */}
                        <Typography color="textSecondary">
                            No recent activities to display
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
