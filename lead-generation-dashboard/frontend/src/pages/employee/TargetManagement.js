import React from 'react';
import { Box, Typography, Grid, Paper, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const mockTargets = [
    {
        id: 1,
        title: 'Lead Generation',
        description: 'Monthly target for new leads',
        target: 100,
        current: 75,
        unit: 'leads',
        deadline: '2025-01-31',
    },
    {
        id: 2,
        title: 'Conversion Rate',
        description: 'Target conversion rate for leads',
        target: 30,
        current: 25,
        unit: '%',
        deadline: '2025-01-31',
    },
    {
        id: 3,
        title: 'Customer Meetings',
        description: 'Monthly target for customer meetings',
        target: 20,
        current: 12,
        unit: 'meetings',
        deadline: '2025-01-31',
    },
];

const TargetManagement = () => {
    const user = useSelector(selectUser);

    const getProgressColor = (progress) => {
        if (progress >= 90) return 'success';
        if (progress >= 60) return 'primary';
        if (progress >= 30) return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Target Management
            </Typography>

            <Grid container spacing={3}>
                {mockTargets.map((target, index) => {
                    const progress = (target.current / target.target) * 100;
                    const progressColor = getProgressColor(progress);

                    return (
                        <Grid item xs={12} md={6} lg={4} key={target.id}>
                            <Paper
                                component={motion.div}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 6,
                                        transform: 'translateY(-4px)',
                                        transition: 'all 0.3s ease-in-out',
                                    },
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {target.title}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {target.description}
                                </Typography>

                                <Box sx={{ mb: 1, flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Progress</Typography>
                                        <Typography variant="body2">
                                            {target.current} / {target.target} {target.unit}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        color={progressColor}
                                        sx={{ height: 8, borderRadius: 1 }}
                                    />
                                </Box>

                                <Typography variant="caption" color="text.secondary">
                                    Deadline: {new Date(target.deadline).toLocaleDateString()}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default TargetManagement;
