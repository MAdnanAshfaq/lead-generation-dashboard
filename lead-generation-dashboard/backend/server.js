require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Auth middleware
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
            if (err) {
                console.log('Token verification failed:', err.message);
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is running' });
});

// Dashboard stats endpoint
app.get('/api/dashboard/manager/stats', authenticateToken, (req, res) => {
    try {
        // Mock data for demonstration
        const stats = {
            totalEmployees: 25,
            activeProfiles: 18,
            totalLeads: 150
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/targets', require('./routes/targets'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/manager', require('./routes/manager'));

const PORT = process.env.PORT || 3001;

// Start server with database connection retry
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Connected to database: lead-Generation`);
            console.log(`CORS enabled for origin: http://localhost:3000`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        // Retry connection after 5 seconds
        console.log('Retrying connection in 5 seconds...');
        setTimeout(startServer, 5000);
    }
};

startServer();
