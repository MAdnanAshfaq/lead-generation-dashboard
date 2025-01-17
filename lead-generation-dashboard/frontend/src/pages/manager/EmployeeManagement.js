import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    Alert,
    Fade,
    TextField,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import axios from 'axios';
import DataTable from '../../components/table/DataTable';
import useTableControls from '../../hooks/useTableControls';
import { hasPermission } from '../../utils/permissions';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { DateRangePicker } from '@mui/lab';

const EmployeeManagement = () => {
    const user = useSelector(selectUser);
    const canUpdateEmployees = hasPermission(user?.role, 'employees', 'update');

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeStats, setEmployeeStats] = useState({ weekly: {}, monthly: {} });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async (dateRange = null) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/employees', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                params: dateRange ? {
                    startDate: dateRange[0],
                    endDate: dateRange[1]
                } : {}
            });
            setEmployees(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch employees');
            console.error('Error fetching employees:', err);
        }
        setLoading(false);
    };

    const columns = [
        {
            field: 'name',
            label: 'Name',
            sortable: true,
            filterable: true,
        },
        {
            field: 'email',
            label: 'Email',
            sortable: true,
            filterable: true,
        },
        {
            field: 'status',
            label: 'Status',
            sortable: true,
            filterable: true,
        },
        {
            field: 'actions',
            label: 'Actions',
            sortable: false,
            filterable: false,
        },
    ];

    const validEmployees = Array.isArray(employees) ? employees : [];

    const {
        page,
        rowsPerPage,
        sortBy,
        filters,
        searchQuery,
        totalCount,
        data: processedData,
        handlePageChange,
        handleRowsPerPageChange,
        handleSortChange,
        handleFilterChange,
        handleSearch,
    } = useTableControls(validEmployees);

    const AnimatedBox = ({ children }) => (
        <Fade in timeout={1000}>
            <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                {children}
            </Box>
        </Fade>
    );

    const handleEmployeeClick = async (employee) => {
        setSelectedEmployee(employee);
        try {
            const response = await axios.get(`/api/users/employees/${employee.id}/stats`);
            setEmployeeStats(response.data);
        } catch (err) {
            setError('Failed to fetch employee stats');
            console.error('Error fetching employee stats:', err);
        }
    };

    const handleClose = () => {
        setSelectedEmployee(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AnimatedBox>
            <Typography variant="h4" gutterBottom>Employee Management</Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ mb: 2 }}>
                <DateRangePicker
                    startText="Start Date"
                    endText="End Date"
                    value={dateRange}
                    onChange={(newValue) => {
                        setDateRange(newValue);
                        fetchEmployees(newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                        <>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                        </>
                    )}
                />
            </Box>
            <DataTable
                columns={columns}
                data={processedData}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                sortBy={sortBy}
                searchQuery={searchQuery}
                filters={filters}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSortChange={handleSortChange}
                onSearchChange={handleSearch}
                onFilterChange={handleFilterChange}
            />
            <List>
                {employees.map((employee) => (
                    <ListItem button key={employee.id} onClick={() => handleEmployeeClick(employee)}>
                        <ListItemText primary={employee.name} />
                    </ListItem>
                ))}
            </List>
            <Dialog open={!!selectedEmployee} onClose={handleClose}>
                <DialogTitle>{selectedEmployee?.name}'s Stats</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Weekly Stats</Typography>
                    <Typography>Targets Achieved: {employeeStats.weekly.targetsAchieved}</Typography>
                    <Typography>Jobs Applied: {employeeStats.weekly.jobsApplied}</Typography>

                    <Typography variant="h6">Monthly Stats</Typography>
                    <Typography>Targets Achieved: {employeeStats.monthly.targetsAchieved}</Typography>
                    <Typography>Jobs Applied: {employeeStats.monthly.jobsApplied}</Typography>
                </DialogContent>
            </Dialog>
        </AnimatedBox>
    );
};

export default EmployeeManagement;
