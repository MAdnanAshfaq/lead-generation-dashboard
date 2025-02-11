import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRole="MANAGER">
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
