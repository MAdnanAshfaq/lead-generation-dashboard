const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
    console.log(`\n=== New Request ===`);
    console.log(`${new Date().toISOString()}`);
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.method !== 'GET') {
        console.log('Body:', req.body);
    }
    next();
});

// Import routes
const authRoutes = require('./routes/auth');
const targetRoutes = require('./routes/targets');
const profileRoutes = require('./routes/profiles');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-generation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('=== MongoDB Connection ===');
    console.log('Status: Connected Successfully');
    console.log('Database URL:', process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-generation');

    // Seed initial data
    const Profile = require('./models/Profile');
    const User = require('./models/User');

    // Create profiles
    await Profile.deleteMany({});
    const profiles = await Profile.create([
        {
            name: 'Raul Rivas',
            status: 'active',
            assignments: []
        },
        {
            name: 'Raul Sanz',
            status: 'active',
            assignments: []
        },
        {
            name: 'Raul Eduardo',
            status: 'active',
            assignments: []
        },
        {
            name: 'Demar Messado',
            status: 'active',
            assignments: []
        }
    ]);
    console.log('Created profiles:', profiles);

    // Create employees
    const employees = [
        {
            name: 'John Employee',
            email: 'john@example.com',
            password: 'password123',
            role: 'employee',
            status: 'active'
        },
        {
            name: 'Jane Employee',
            email: 'jane@example.com',
            password: 'password123',
            role: 'employee',
            status: 'active'
        },
        {
            name: 'Bob Employee',
            email: 'bob@example.com',
            password: 'password123',
            role: 'employee',
            status: 'active'
        }
    ];

    // Create employees if they don't exist
    for (const emp of employees) {
        const existingUser = await User.findOne({ email: emp.email });
        if (!existingUser) {
            const user = new User(emp);
            await user.save();
            console.log('Created employee:', user);
        }
    }
})
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Welcome to Lead Generation Dashboard API',
        version: '1.0.0'
    });
});

// Handle 404
app.use((req, res) => {
    console.log('404 - Route not found:', req.originalUrl);
    res.status(404).json({ 
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('=== Error ===');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages
        });
    }

    // Handle mongoose duplicate key errors
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate Error',
            error: 'A record with this value already exists'
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: err.message
        });
    }

    // Handle other errors
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=== Server Started ===`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Port: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('=== Server Error ===');
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port or kill the process using this port.`);
        process.exit(1);
    } else {
        console.error('Error:', error);
        process.exit(1);
    }
});
