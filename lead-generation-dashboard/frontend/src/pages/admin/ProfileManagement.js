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
    department: Yup.string().required('Department is required'),
    position: Yup.string().required('Position is required'),
    location: Yup.string().required('Location is required'),
    status: Yup.string().required('Status is required'),
});

const departments = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR'];
const positions = ['Team Lead', 'Manager', 'Associate', 'Senior Associate', 'Director'];
const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];
const statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

const ProfileManagement = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const canEditProfiles = hasPermission(user?.role, 'profiles', 'update');
    const canDeleteProfiles = hasPermission(user?.role, 'profiles', 'delete');
    const canCreateProfiles = hasPermission(user?.role, 'profiles', 'create');

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('/profiles', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setProfiles(data);
        } catch (error) {
            notify.error('Failed to fetch profiles');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProfile = async (values, { resetForm }) => {
        try {
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            setProfiles([...profiles, data]);
            notify.success('Profile created successfully');
            handleCloseDialog();
            resetForm();
        } catch (error) {
            notify.error('Failed to create profile');
        }
    };

    const handleUpdateProfile = async (values, { resetForm }) => {
        try {
            const response = await fetch(`/api/profiles/${selectedProfile.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            setProfiles(profiles.map(p => p.id === data.id ? data : p));
            notify.success('Profile updated successfully');
            handleCloseDialog();
            resetForm();
        } catch (error) {
            notify.error('Failed to update profile');
        }
    };

    const handleDeleteProfile = async (id) => {
        if (!window.confirm('Are you sure you want to delete this profile?')) return;
        
        try {
            await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
            setProfiles(profiles.filter(p => p.id !== id));
            notify.success('Profile deleted successfully');
        } catch (error) {
            notify.error('Failed to delete profile');
        }
    };

    const handleOpenDialog = (profile = null) => {
        setSelectedProfile(profile);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedProfile(null);
        setOpenDialog(false);
    };

    const columns = [
        { field: 'department', label: 'Department', sortable: true, filterable: true },
        { field: 'position', label: 'Position', sortable: true, filterable: true },
        { field: 'location', label: 'Location', sortable: true, filterable: true },
        { field: 'status', label: 'Status', sortable: true, filterable: true },
        {
            field: 'actions',
            label: 'Actions',
            render: (row) => (
                <Box>
                    {canEditProfiles && (
                        <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(row)}
                            color="primary"
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                    {canDeleteProfiles && (
                        <IconButton
                            size="small"
                            onClick={() => handleDeleteProfile(row.id)}
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
                    <Typography variant="h5">Profile Management</Typography>
                    {canCreateProfiles && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add Profile
                        </Button>
                    )}
                </Box>

                <DataTable
                    columns={columns}
                    data={profiles}
                    loading={loading}
                    pagination
                    sortable
                    filterable
                />
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedProfile ? 'Edit Profile' : 'Create Profile'}
                </DialogTitle>
                <Formik
                    initialValues={selectedProfile || {
                        department: '',
                        position: '',
                        location: '',
                        status: 'ACTIVE',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={selectedProfile ? handleUpdateProfile : handleCreateProfile}
                >
                    {({ values, handleChange, handleBlur, touched, errors }) => (
                        <Form>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    select
                                    name="department"
                                    label="Department"
                                    value={values.department}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.department && Boolean(errors.department)}
                                    helperText={touched.department && errors.department}
                                    margin="normal"
                                >
                                    {departments.map((dept) => (
                                        <MenuItem key={dept} value={dept}>
                                            {dept}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    select
                                    name="position"
                                    label="Position"
                                    value={values.position}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.position && Boolean(errors.position)}
                                    helperText={touched.position && errors.position}
                                    margin="normal"
                                >
                                    {positions.map((pos) => (
                                        <MenuItem key={pos} value={pos}>
                                            {pos}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    select
                                    name="location"
                                    label="Location"
                                    value={values.location}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.location && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    margin="normal"
                                >
                                    {locations.map((loc) => (
                                        <MenuItem key={loc} value={loc}>
                                            {loc}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    select
                                    name="status"
                                    label="Status"
                                    value={values.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.status && Boolean(errors.status)}
                                    helperText={touched.status && errors.status}
                                    margin="normal"
                                >
                                    {statuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancel</Button>
                                <Button type="submit" variant="contained" color="primary">
                                    {selectedProfile ? 'Update' : 'Create'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </Box>
    );
};

export default ProfileManagement;
