import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/permissions';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Unauthorized from '../pages/auth/Unauthorized';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import ProfileManagement from '../pages/admin/ProfileManagement';

// Manager Pages
import ManagerDashboard from '../pages/manager/Dashboard';
import EmployeeManagement from '../pages/manager/EmployeeManagement';
import Reports from '../pages/manager/Reports';
import TargetAssignment from '../pages/manager/TargetAssignment';

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import TargetManagement from '../pages/employee/TargetManagement';
import Stats from '../pages/employee/Stats';

const Router = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute
                    requiredRole={ROLES.ADMIN}
                    requiredPermissions={[
                        { resource: 'users', action: 'read' },
                        { resource: 'stats', action: 'read' },
                    ]}
                >
                    <DashboardLayout>
                        <AdminDashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute
                    requiredRole={ROLES.ADMIN}
                    requiredPermissions={[
                        { resource: 'users', action: 'read' },
                        { resource: 'users', action: 'create' },
                        { resource: 'users', action: 'update' },
                        { resource: 'users', action: 'delete' },
                    ]}
                >
                    <DashboardLayout>
                        <UserManagement />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/profiles" element={
                <ProtectedRoute
                    requiredRole={ROLES.ADMIN}
                    requiredPermissions={[
                        { resource: 'profiles', action: 'read' },
                        { resource: 'profiles', action: 'create' },
                        { resource: 'profiles', action: 'update' },
                        { resource: 'profiles', action: 'delete' },
                    ]}
                >
                    <DashboardLayout>
                        <ProfileManagement />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Manager Routes */}
            <Route path="/manager" element={
                <ProtectedRoute
                    requiredRole={ROLES.MANAGER}
                    requiredPermissions={[
                        { resource: 'employees', action: 'read' },
                        { resource: 'stats', action: 'read' },
                    ]}
                >
                    <DashboardLayout>
                        <ManagerDashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/manager/employees" element={
                <ProtectedRoute
                    requiredRole={ROLES.MANAGER}
                    requiredPermissions={[{ resource: 'employees', action: 'view' }]}
                >
                    <DashboardLayout>
                        <EmployeeManagement />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/manager/reports" element={
                <ProtectedRoute
                    requiredRole={ROLES.MANAGER}
                    requiredPermissions={[{ resource: 'reports', action: 'read' }]}
                >
                    <DashboardLayout>
                        <Reports />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/manager/targets" element={
                <ProtectedRoute
                    requiredRole={ROLES.MANAGER}
                    requiredPermissions={[{ resource: 'targets', action: 'manage' }]}
                >
                    <DashboardLayout>
                        <TargetAssignment />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Employee Routes */}
            <Route path="/employee" element={
                <ProtectedRoute
                    requiredRole={ROLES.EMPLOYEE}
                    requiredPermissions={[{ resource: 'stats', action: 'read' }]}
                >
                    <DashboardLayout>
                        <EmployeeDashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/employee/targets" element={
                <ProtectedRoute
                    requiredRole={ROLES.EMPLOYEE}
                    requiredPermissions={[{ resource: 'targets', action: 'read' }]}
                >
                    <DashboardLayout>
                        <TargetManagement />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/employee/stats" element={
                <ProtectedRoute
                    requiredRole={ROLES.EMPLOYEE}
                    requiredPermissions={[{ resource: 'stats', action: 'read' }]}
                >
                    <DashboardLayout>
                        <Stats />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Redirect root to appropriate dashboard based on role */}
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default Router;
