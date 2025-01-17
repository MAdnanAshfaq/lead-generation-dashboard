import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Notification from './components/feedback/Notification';
import LoadingScreen from './components/feedback/LoadingScreen';
import { selectLoading } from './store/slices/uiSlice';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/auth/Unauthorized';
import { getCurrentUser, selectIsAuthenticated, selectUser } from './store/slices/authSlice';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ProfileManagement from './pages/admin/ProfileManagement';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import EmployeeManagement from './pages/manager/EmployeeManagement';
import Reports from './pages/manager/Reports';
import TargetAssignment from './pages/manager/TargetAssignment';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import TargetManagement from './pages/employee/TargetManagement';
import Stats from './pages/employee/Stats';

// New Pages
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Users from './pages/Users';
import Pricing from './pages/Pricing';
import Integrations from './pages/Integrations';
import ComponentLibrary from './pages/ComponentLibrary';
import Settings from './pages/Settings';
import TemplatePages from './pages/TemplatePages';
import AccountSettings from './pages/AccountSettings';

const PrivateRoute = ({ children, roles }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user?.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const loading = useSelector(selectLoading);

    React.useEffect(() => {
        if (localStorage.getItem('token') && !user) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, user]);

    const getHomePage = () => {
        switch (user?.role) {
            case 'admin':
                return <Navigate to="/admin" />;
            case 'manager':
                return <Navigate to="/manager" />;
            case 'employee':
                return <Navigate to="/employee" />;
            default:
                return <Navigate to="/login" />;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                {loading && <LoadingScreen />}
                <Notification />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
                    <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><UserManagement /></PrivateRoute>} />
                    <Route path="/admin/profiles" element={<PrivateRoute roles={['admin']}><ProfileManagement /></PrivateRoute>} />

                    {/* Manager Routes */}
                    <Route path="/manager" element={<PrivateRoute roles={['manager']}><ManagerDashboard /></PrivateRoute>} />
                    <Route path="/manager/employees" element={<PrivateRoute roles={['manager']}><EmployeeManagement /></PrivateRoute>} />
                    <Route path="/manager/targets" element={<PrivateRoute roles={['manager']}><TargetAssignment /></PrivateRoute>} />
                    <Route path="/manager/reports" element={<PrivateRoute roles={['manager']}><Reports /></PrivateRoute>} />

                    {/* Employee Routes */}
                    <Route path="/employee" element={<PrivateRoute roles={['employee']}><EmployeeDashboard /></PrivateRoute>} />
                    <Route path="/employee/targets" element={<PrivateRoute roles={['employee']}><TargetManagement /></PrivateRoute>} />
                    <Route path="/employee/stats" element={<PrivateRoute roles={['employee']}><Stats /></PrivateRoute>} />

                    {/* New Routes */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/features" element={<PrivateRoute><Features /></PrivateRoute>} />
                    <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                    <Route path="/pricing" element={<PrivateRoute><Pricing /></PrivateRoute>} />
                    <Route path="/integrations" element={<PrivateRoute><Integrations /></PrivateRoute>} />
                    <Route path="/component-library" element={<PrivateRoute><ComponentLibrary /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    <Route path="/template-pages" element={<PrivateRoute><TemplatePages /></PrivateRoute>} />
                    <Route path="/account-settings" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />

                    {/* Default Route */}
                    <Route path="/" element={getHomePage()} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
