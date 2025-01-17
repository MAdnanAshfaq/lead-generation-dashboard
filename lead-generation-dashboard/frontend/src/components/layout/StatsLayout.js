import React from 'react';
import { Grid, Container, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { varFadeInUp } from '../animate/variants/fade';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const StatsLayout = ({ children }) => {
    return (
        <SimpleBar style={{ maxHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box
                    component={motion.div}
                    variants={varFadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <Grid container spacing={3}>
                        {React.Children.map(children, (child, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                component={motion.div}
                                variants={varFadeInUp}
                                transition={{ delay: index * 0.1 }}
                            >
                                {child}
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </SimpleBar>
    );
};

export default StatsLayout;
