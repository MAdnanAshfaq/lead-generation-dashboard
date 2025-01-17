import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box,
    Tooltip,
} from '@mui/material';

const StatCard = ({ title, current, target, icon: Icon, color = 'primary' }) => {
    const percentage = target > 0 ? Math.round((current / target) * 100) : 0;

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {Icon && (
                        <Box sx={{ mr: 2, color: `${color}.main` }}>
                            <Icon fontSize="large" />
                        </Box>
                    )}
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>

                <Typography variant="h4" component="div" gutterBottom>
                    {current}
                    <Typography
                        component="span"
                        variant="subtitle1"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                    >
                        / {target}
                    </Typography>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                        <Tooltip title={`${percentage}% Completed`}>
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                color={color}
                            />
                        </Tooltip>
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="textSecondary">
                            {percentage}%
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const StatsSummary = ({ stats, layout = { xs: 12, sm: 6, md: 3 } }) => {
    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
                <Grid item {...layout} key={index}>
                    <StatCard {...stat} />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsSummary;
