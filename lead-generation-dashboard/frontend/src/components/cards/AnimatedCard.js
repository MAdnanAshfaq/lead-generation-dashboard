import React from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AnimatedCard = ({ title, value, icon, color = 'primary', delay = 0 }) => {
    const theme = useTheme();
    const cardColor = theme.palette[color] || theme.palette.primary;

    return (
        <Card
            component={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay }}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                minHeight: 160,
                p: 3,
                background: `linear-gradient(135deg, ${cardColor.light || cardColor.main} 0%, ${cardColor.main} 100%)`,
                color: 'white',
                boxShadow: `0 8px 16px 0 ${cardColor.main}40`,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: `0 12px 24px 0 ${cardColor.main}40`,
                },
            }}
        >
            <Box
                component={motion.div}
                animate={{
                    scale: [1, 1.1, 1.1, 1, 1],
                    rotate: [0, 0, 180, 180, 0],
                    opacity: [1, 0.5, 0.5, 0.5, 1],
                }}
                transition={{
                    duration: 4,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                }}
                sx={{
                    position: 'absolute',
                    right: -10,
                    bottom: -10,
                    opacity: 0.24,
                    color: 'white',
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: 100, ...icon.props.sx } })}
            </Box>

            <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ mb: 1, color: 'inherit', fontWeight: 'bold' }}>
                    {value}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'inherit', opacity: 0.72 }}>
                    {title}
                </Typography>
            </Box>
        </Card>
    );
};

export default AnimatedCard;
