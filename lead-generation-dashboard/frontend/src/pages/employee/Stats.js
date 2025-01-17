import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, CircularProgress } from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Assessment as AssessmentIcon,
    Timer as TimerIcon,
} from '@mui/icons-material';
import AnimatedCard from '../../components/cards/AnimatedCard';
import StatsLayout from '../../components/layout/StatsLayout';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const mockStats = {
    dailyLeads: 25,
    conversionRate: 32,
    activeLeads: 150,
    avgResponseTime: '2.5h',
};

const Stats = () => {
    const [stats, setStats] = useState(mockStats);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector(selectUser);

    const statCards = [
        {
            title: 'Daily Leads',
            value: stats.dailyLeads,
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            color: 'primary',
            delay: 0,
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversionRate}%`,
            icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
            color: 'success',
            delay: 0.2,
        },
        {
            title: 'Active Leads',
            value: stats.activeLeads,
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            color: 'warning',
            delay: 0.4,
        },
        {
            title: 'Avg Response Time',
            value: stats.avgResponseTime,
            icon: <TimerIcon sx={{ fontSize: 40 }} />,
            color: 'info',
            delay: 0.6,
        },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <StatsLayout>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Statistics
                </Typography>

                <Grid container spacing={3}>
                    {statCards.map((card, index) => (
                        <Grid key={card.title} item xs={12} sm={6} md={3}>
                            <AnimatedCard {...card} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </StatsLayout>
    );
};

export default Stats;
