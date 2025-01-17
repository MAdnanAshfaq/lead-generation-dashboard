import React from 'react';
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { varFadeIn } from '../../components/animate/variants/fade';

const Register = () => {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'EMPLOYEE',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required')
                .min(2, 'Name must be at least 2 characters'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                ),
            confirmPassword: Yup.string()
                .required('Please confirm your password')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            role: Yup.string().required('Role is required'),
        }),
        onSubmit: (values) => {
            // Handle registration logic
            console.log('Registration values:', values);
        },
    });

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
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <Card
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 480,
                }}
            >
                <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
                    Register
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />

                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />

                        <TextField
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={formik.values.role}
                                label="Role"
                                onChange={formik.handleChange}
                                error={formik.touched.role && Boolean(formik.errors.role)}
                            >
                                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                                <MenuItem value="MANAGER">Manager</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Register
                        </Button>

                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" variant="subtitle2">
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </Card>
        </Box>
    );
};

export default Register;
