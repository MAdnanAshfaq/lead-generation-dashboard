import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Typography,
    Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DataTable from '../../components/table/DataTable';
import { notify } from '../../components/feedback/Notification';
import { selectUser } from '../../store/slices/authSlice';
import { hasPermission } from '../../utils/permissions';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string().test('password', 'Invalid password', function(value) {
        if (!this.parent.isNew && !value) return true;
        return value && value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);
    }),
    confirmPassword: Yup.string().test('confirmPassword', 'Passwords must match', function(value) {
        if (!this.parent.password) return true;
        return value === this.parent.password;
    }),
    isNew: Yup.boolean()
});

const roles = ['admin', 'manager', 'employee'];

const UserManagement = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const canEditUsers = hasPermission(user?.role, 'users', 'update');
    const canDeleteUsers = hasPermission(user?.role, 'users', 'delete');
    const canCreateUsers = hasPermission(user?.role, 'users', 'create');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch users');
            }
            
            setUsers(result.data || []);
        } catch (error) {
            notify.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (values, { resetForm, setSubmitting }) => {
        try {
            const { confirmPassword, isNew, ...userData } = values;
            
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create user');
            }

            setUsers([...users, result.data]);
            notify.success('User created successfully');
            handleCloseDialog();
            resetForm();
        } catch (error) {
            notify.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateUser = async (values, { resetForm, setSubmitting }) => {
        try {
            const { confirmPassword, isNew, ...updateData } = values;
            
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await fetch(`/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update user');
            }

            setUsers(users.map(u => u._id === result.data._id ? result.data : u));
            notify.success('User updated successfully');
            handleCloseDialog();
            resetForm();
        } catch (error) {
            notify.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete user');
            }

            setUsers(users.filter(u => u._id !== id));
            notify.success('User deleted successfully');
        } catch (error) {
            notify.error(error.message);
        }
    };

    const handleOpenDialog = (user = null) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedUser(null);
        setOpenDialog(false);
    };

    const columns = [
        { field: 'name', label: 'Name', sortable: true, filterable: true },
        { field: 'email', label: 'Email', sortable: true, filterable: true },
        { field: 'role', label: 'Role', sortable: true, filterable: true },
        {
            field: 'actions',
            label: 'Actions',
            render: (row) => (
                <Box>
                    {canEditUsers && (
                        <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(row)}
                            color="primary"
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                    {canDeleteUsers && (
                        <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(row._id)}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box p={3}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">User Management</Typography>
                    {canCreateUsers && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add User
                        </Button>
                    )}
                </Box>

                <DataTable
                    columns={columns}
                    data={users}
                    loading={loading}
                    pagination
                    sortable
                    filterable
                />
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Create User'}
                </DialogTitle>
                <Formik
                    initialValues={{
                        name: selectedUser?.name || '',
                        email: selectedUser?.email || '',
                        role: selectedUser?.role || 'employee',
                        password: '',
                        confirmPassword: '',
                        isNew: !selectedUser,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
                >
                    {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    margin="normal"
                                />

                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    margin="normal"
                                />

                                <TextField
                                    fullWidth
                                    select
                                    name="role"
                                    label="Role"
                                    value={values.role}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.role && Boolean(errors.role)}
                                    helperText={touched.role && errors.role}
                                    margin="normal"
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    name="password"
                                    label={selectedUser ? "New Password (leave blank to keep current)" : "Password"}
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    margin="normal"
                                />

                                {(values.password || !selectedUser) && (
                                    <TextField
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                        margin="normal"
                                    />
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancel</Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    {selectedUser ? 'Update' : 'Create'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
