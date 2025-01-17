import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { varFadeIn } from '../../components/animate/variants/fade';
import { LockPerson } from '@mui/icons-material';

const Unauthorized = () => {
    return (
        <Box
            component={motion.div}
            variants={varFadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 3,
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                }}
            >
                <LockPerson
                    sx={{
                        fontSize: 100,
                        color: 'error.main',
                        mb: 3,
                    }}
                />
            </motion.div>

            <Typography variant="h3" paragraph>
                Access Denied
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 4 }}>
                You do not have permission to access this page.
                <br />
                Please contact your administrator for more information.
            </Typography>

            <Button
                to="/"
                size="large"
                variant="contained"
                component={RouterLink}
            >
                Go to Home
            </Button>
        </Box>
    );
};

export default Unauthorized;
